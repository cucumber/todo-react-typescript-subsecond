import http, { RequestListener } from 'http'
import { promisify } from 'util'
import { AddressInfo } from 'net'

export default class Server {
  private readonly server: http.Server

  constructor(requestListener: RequestListener) {
    this.server = http.createServer(requestListener)
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
