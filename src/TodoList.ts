export default class TodoList {
  private readonly todos: string[] = []

  add(todo: string) {
    this.todos.push(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todos
  }
}
