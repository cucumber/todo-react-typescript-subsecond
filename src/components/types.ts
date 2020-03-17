type UseTodoList = () => ReadonlyArray<string> | null
type AddTodo = (todo: string) => Promise<void>
