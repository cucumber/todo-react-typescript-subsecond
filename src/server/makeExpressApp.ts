import express from 'express'
import bodyParser from 'body-parser'
import SseStream from 'ssestream'
import TodoList from '../TodoList'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('../../webpack.config.js')

export default function makeExpressApp(serveAssets: boolean) {
  const todoList = new TodoList()
  const sses = new Set<SseStream>()

  const app = express()
  app.use(bodyParser.json())

  if (serveAssets) {
    const compiler = webpack(webpackConfig)
    app.use(
      webpackMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
      })
    )
    app.use(express.static(__dirname + '/../../public'))
  }

  app.get('/eventsource', (req, res) => {
    const sse = new SseStream(req)
    sses.add(sse)
    sse.pipe(res)
    req.on('close', () => {
      sse.unpipe(res)
      sses.delete(sse)
    })
  })

  app.get('/todos', (req, res) => {
    res.json(todoList.getTodos())
  })

  app.post('/todos', (req, res) => {
    const { todo } = req.body
    todoList.add(todo)
    for (const sse of sses) {
      sse.writeMessage({ event: 'todos-updated', data: 'x' })
    }
    res.end()
  })

  return app
}
