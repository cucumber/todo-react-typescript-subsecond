import {
  defineParameterType,
  Given,
  setWorldConstructor,
  Then,
  When,
} from 'cucumber'
import assert from 'assert'
import IActor from '../../src/IActor'
import MemoryActor from '../../src/MemoryActor'
import ReactActor from '../../src/ReactActor'

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName: string): IActor {
    return this.getActorByName(actorName)
  },
})

class TodoWorld {
  private readonly actorsByName = new Map<string, IActor>()

  getActorByName(name: string): IActor {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if(process.env.ASSEMBLY === 'react') {
        actor = new ReactActor()
      } else {
        actor = new MemoryActor()
      }
      this.actorsByName.set(name, actor)
    }
    return actor
  }
}

setWorldConstructor(TodoWorld)

Given('{actor} has already added {int} todo', function(
  actor: IActor,
  todoCount: number
) {
  for (let n = 0; n < todoCount; n++) {
    actor.addTodo(`TODO #${n + 1}`)
  }
})

When('{actor} adds {string}', function(actor: IActor, todo: string) {
  actor.addTodo(todo)
})

Then('{actor} should see {string} at the top', function(
  actor: IActor,
  expectedTodo: string
) {
  // Write code here that turns the phrase above into concrete actions
  const secondTodo = actor.getTodos()[0]
  assert.strictEqual(secondTodo, expectedTodo)
})
