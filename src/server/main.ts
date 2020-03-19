import Server from './Server'
import makeExpressApp from './makeExpressApp'
import makeWebpackMiddleware from './makeWebpackMiddleware'
import makeStaticMiddleware from './makeStaticMiddleware'

async function main() {
  const app = makeExpressApp(makeWebpackMiddleware(), makeStaticMiddleware())
  const server = new Server(app)
  await server.listen(3000)
  console.log(`TODO app ready on http://localhost:${server.port}`)
}

main().catch(err => console.error(err))
