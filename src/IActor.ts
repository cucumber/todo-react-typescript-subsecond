export default interface IActor {
  addTodo(todo: string): Promise<void>

  getTodos(): ReadonlyArray<string>
}
