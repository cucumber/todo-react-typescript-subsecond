import http, { RequestListener } from 'http'
import { promisify } from 'util'
import { AddressInfo } from 'net'
import makeExpressApp from './makeExpressApp'

export default class Server {
  private readonly server: http.Server

  constructor() {
    this.server = http.createServer(makeExpressApp())
  }

  async listen(port: number) {
    const listen = promisify(this.server.listen.bind(this.server))
    await listen(port)
  }

  get port() {
    return (this.server.address() as AddressInfo).port
  }

  async close() {
    const close = promisify(this.server.close.bind(this.server))
    await close()
  }
}
