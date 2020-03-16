import { Given, Then, When } from 'cucumber'
import assert from 'assert'
import IActor from '../../src/IActor'

Given('{actor} has already added {int} todo', async function(actor: IActor, todoCount: number) {
  for (let n = 0; n < todoCount; n++) {
    await actor.addTodo(`TODO #${n + 1}`)
  }
})

When('{actor} adds {string}', async function(actor: IActor, todo: string) {
  await actor.addTodo(todo)
})

Then('{actor} should see {string} at the top', function(actor: IActor, expectedTodo: string) {
  // Write code here that turns the phrase above into concrete actions
  const secondTodo = actor.getTodos()[0]
  assert.strictEqual(secondTodo, expectedTodo)
})
