export default interface ITodoList {
  add(todo: string): void

  getTodos(): ReadonlyArray<string>
}
