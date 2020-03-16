import ITodoList from './ITodoList'

export default class TodoList implements ITodoList {
  private readonly todos: string[] = []

  add(todo: string) {
    this.todos.unshift(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todos
  }
}
