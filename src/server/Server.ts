import http from 'http'
import { promisify } from 'util'
import { AddressInfo } from 'net'
import makeExpressApp from './makeExpressApp'
import TodoList from './TodoList'

export default class Server {
  private readonly server: http.Server

  constructor(todoList: TodoList) {
    this.server = http.createServer(makeExpressApp(todoList))
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
    const close = promisify(this.server.close.bind(this.server))
    await close()
  }
}
