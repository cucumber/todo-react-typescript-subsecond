import Server from './Server'

async function main() {
  const server = new Server()
  await server.listen(Number(process.env['PORT'] || 3000))
  console.log(`TODOs ready on http://localhost:${server.port}`)
}

main().catch(err => console.error(err))
