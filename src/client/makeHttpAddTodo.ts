/**
 * Makes a {@link AddTodo} function that uses {@link fetch} to POST new todos
 * to the server
 *
 * @param baseURL the base URL of the server
 */
import { AddTodo } from './components/types'

export default function makeHttpAddTodo(baseURL: URL): AddTodo {
  return async (todo: string): Promise<void> => {
    const url = new URL('/todos', baseURL).toString()
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo }),
    })
    if (response.status >= 400) {
      throw new Error(`POST failed with status ${response.status}`)
    }
  }
}
