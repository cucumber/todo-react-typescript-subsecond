import ITodoList from './ITodoList'

export default class TodoList implements ITodoList {
  private readonly todos: string[] = []

  add(todo: string) {
    this.todos.push(todo)
  }

  getTodos(): ReadonlyArray<string> {
    return this.todos
  }
}
