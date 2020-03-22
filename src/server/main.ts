import Server from './Server'
import TodoList from './TodoList'

async function main() {
  const todoList = new TodoList()
  const server = new Server(todoList)
  await server.listen(Number(process.env['PORT'] || 3000))
  console.log(`TODOs ready on http://localhost:${server.port}`)
}

main().catch(err => console.error(err))
