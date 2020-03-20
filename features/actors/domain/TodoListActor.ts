import IActor from '../IActor'
import TodoList from '../../../src/server/TodoList'

export default class TodoListActor implements IActor {
  private readonly todoList = new TodoList()

  async addTodo(todo: string): Promise<void> {
    this.todoList.add(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todoList.getTodos()
  }

  start(): Promise<void> {
    return Promise.resolve()
  }

  close(): Promise<void> {
    return Promise.resolve()
  }
}
