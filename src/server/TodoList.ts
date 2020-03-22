export default class TodoList {
  private readonly todos: string[] = []

  add(todo: string) {
    this.todos.unshift(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todos
  }

  clear() {
    // Yes, this actually clears the array
    // https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript/1234337#1234337
    this.todos.length = 0
  }
}
