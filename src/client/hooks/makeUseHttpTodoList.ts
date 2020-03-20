import { useEffect, useState } from 'react'

export default function makeUseHttpTodoList(baseURL: URL): UseTodoList {
  return (setError: SetError) => {
    const [todos, setTodos] = useState<ReadonlyArray<string> | null>(null)

    useEffect(() => {
      const eventSource = new EventSource(new URL('/eventsource', baseURL).toString())
      eventSource.addEventListener('todos-updated', () => fetchAndSetTodos().catch(setError))
      eventSource.onerror = () => setError(new Error('EventSource error'))
      eventSource.onopen = () => setError(null)
      fetchAndSetTodos().catch(setError)

      return () => eventSource.close()
    }, [])

    async function fetchAndSetTodos() {
      const response = await fetch(new URL('/todos', baseURL).toString())
      const todos = await response.json()
      setTodos(todos)
    }

    return todos
  }
}
