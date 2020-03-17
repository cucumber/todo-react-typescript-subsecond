export default function makeHttpAddTodo(baseURL: URL): AddTodo {
  return async (todo: string): Promise<void> => {
    const response = await fetch(new URL('/todos', baseURL).toString(), {
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
