export default interface IActor {
  addTodo(todo: string): Promise<void>

  getTodos(): ReadonlyArray<string> | null

  start(): Promise<void>
  stop(): Promise<void>
}
