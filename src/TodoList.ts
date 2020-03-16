export default class TodoList {
  private readonly todos: string[] = []

  add(todo: string) {
    this.todos.unshift(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todos
  }
}
