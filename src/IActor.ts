export default interface IActor {
  addTodo(todo: string): void

  getTodos(): ReadonlyArray<string>
}
