export default interface IActor {
  addTodo(todo: string): Promise<void>

  getTodos(): ReadonlyArray<string>

  start(): Promise<void>
  close(): Promise<void>
}
