import IActor from './IActor'
import TodoList from './TodoList'

export default class TodoListActor implements IActor {
  private readonly todoList = new TodoList()

  addTodo(todo: string): void {
    this.todoList.add(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todoList.getTodos()
  }
}
