import express, { Express } from 'express'
import bodyParser from 'body-parser'
import SseStream from 'ssestream'
import TodoList from './TodoList'

/**
 * @return a request listener and a function to close connected event sources
 * @param todoList
 */
export default function makeExpressApp(todoList: TodoList): Express {
  const connectedEventSources = new Set<SseStream>()
  const app = express()

  app.use(bodyParser.json())
  app.use(express.static(__dirname + '/../../public'))

  app.get('/eventsource', (req, res) => {
    const sse = new SseStream(req)
    connectedEventSources.add(sse)
    sse.pipe(res)
    req.on('close', () => {
      connectedEventSources.delete(sse)
      sse.end()
    })
  })

  app.get('/todos', (req, res) => {
    res.json(todoList.getTodos())
  })

  app.post('/todos', (req, res) => {
    const { todo } = req.body
    todoList.add(todo)
    for (const sse of connectedEventSources) {
      sse.writeMessage({ event: 'todos-updated', data: 'x' })
    }
    res.end()
  })

  return app
}
