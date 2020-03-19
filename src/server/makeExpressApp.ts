import express, { RequestHandler } from 'express'
import bodyParser from 'body-parser'
import SseStream from 'ssestream'
import TodoList from '../TodoList'

export default function makeExpressApp(...middlewares: RequestHandler[]) {
  const todoList = new TodoList()
  const sses = new Set<SseStream>()

  const app = express()
  app.use(bodyParser.json())

  for (const middleware of middlewares) {
    app.use(middleware)
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
