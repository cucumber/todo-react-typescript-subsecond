import IActor from './IActor'
import TodoList from './TodoList'

export default class TodoListActor implements IActor {
  private readonly todoList = new TodoList()

  async addTodo(todo: string): Promise<void> {
    this.todoList.add(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todoList.getTodos()
  }
}
