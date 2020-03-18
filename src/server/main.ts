import Server from './Server'
import makeExpressApp from './makeExpressApp'
async function main() {
  const app = makeExpressApp(true)
  const server = new Server(app)
  await server.listen(3000)
  console.log(`TODO app ready on http://localhost:${server.port}`)
}

main().catch(err => console.error(err))
