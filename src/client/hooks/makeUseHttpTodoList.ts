import { useEffect, useState } from 'react'
import { SetError, UseTodoList } from '../components/types'

/**
 * Makes a {@link UseTodoList} React hook that uses an EventSource connection
 * to signal when the server's todolist has been updated.
 *
 * @param baseURL the base URL of the server
 * @param eventSource the eventSource to get update notifications from
 * @return a {@link UseTodoList} React hook
 */
export default function makeUseHttpTodoList(baseURL: URL, eventSource: EventSource): UseTodoList {
  return (setError: SetError) => {
    const [todos, setTodos] = useState<ReadonlyArray<string> | null>(null)

    useEffect(() => {
      const fetchAndSetTodosListener = () => fetchAndSetTodos().catch(setError)
      eventSource.addEventListener('todos-updated', fetchAndSetTodosListener)
      fetchAndSetTodos().catch(setError)
      return () => eventSource.removeEventListener('todos-updated', fetchAndSetTodosListener)
    }, [])

    async function fetchAndSetTodos() {
      const response = await fetch(new URL('/todos', baseURL).toString())
      try {
        const todos = await response.json()
        setTodos(todos)
      } catch (notJson) {
        const text = await response.text()
        setError(new Error(`Not JSON:\n${text}`))
      }
    }

    return todos
  }
}
