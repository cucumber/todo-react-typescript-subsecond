type SetError = (error: Error | null) => void
type UseTodoList = (setError: SetError) => ReadonlyArray<string> | null
type AddTodo = (todo: string) => Promise<void>
