import IActor from '../../src/IActor'
import ReactActor from '../../src/ReactActor'
import TodoListActor from '../../src/TodoListActor'
import { defineParameterType, setWorldConstructor } from 'cucumber'
import TodoList from '../../src/TodoList'

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName: string): IActor {
    // this is an instance of TodoWorld
    return this.getActorByName(actorName)
  },
})

class TodoWorld {
  private readonly actorsByName = new Map<string, IActor>()

  getActorByName(name: string): IActor {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        const todoList = new TodoList()
        const useTodoList: UseTodoList = () => todoList.getTodos()
        const useAddTodo: UseAddTodo = () => (todo: string) => todoList.add(todo)
        actor = new ReactActor(useTodoList, useAddTodo)
      } else {
        actor = new TodoListActor()
      }
      this.actorsByName.set(name, actor)
    }
    return actor
  }
}

setWorldConstructor(TodoWorld)
