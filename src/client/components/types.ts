export type SetError = (error: Error | null) => void
export type UseTodoList = (setError: SetError) => ReadonlyArray<string> | null
export type AddTodo = (todo: string) => Promise<void>
export type UseDisconnected = () => boolean
