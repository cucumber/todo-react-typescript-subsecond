import http from 'http'
import { promisify } from 'util'
import { AddressInfo, Socket } from 'net'
import makeExpressApp from './makeExpressApp'
import TodoList from './TodoList'
import { Express } from 'express'

export default class Server {
  private readonly server: http.Server
  private readonly sockets = new Set<Socket>()
  private readonly express: Express

  constructor(todoList: TodoList) {
    this.express = makeExpressApp(todoList)
    this.server = http.createServer(this.express)
    this.server.on('connection', (socket) => {
      this.sockets.add(socket)
      socket.once('close', () => {
        this.sockets.delete(socket)
      })
    })
  }

  async listen(port: number) {
    const listen = promisify(this.server.listen.bind(this.server))
    await listen(port)
  }

  get port() {
    const address = this.server.address() as AddressInfo
    return address.port
  }

  async close() {
    await new Promise((resolve) => {
      this.server.once('close', resolve)
      this.server.close()
      for (const socket of this.sockets) {
        socket.destroy()
      }
    })
  }
}
