import { useEffect, useState } from 'react'

export default function makeUseHttpTodoList(baseURL: URL): UseTodoList {
  return function useHttpTodoList() {
    const [todos, setTodos] = useState<ReadonlyArray<string> | null>(null)

    useEffect(() => {
      const eventSource = new EventSource(new URL('/eventsource', baseURL).toString())
      eventSource.addEventListener('todos-updated', () => {
        fetchAndSetTodos()
          // TODO: better error handling needed
          .catch(err => console.error(err))
      })
      // TODO: better error handling needed
      eventSource.onerror = event => console.error('EventSource error', event)
      fetchAndSetTodos()
        // TODO: better error handling needed
        .catch(err => console.error(err))

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
