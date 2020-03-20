import webdriver from 'selenium-webdriver'
import IActor from '../actors/IActor'
import ReactActor from '../actors/react/ReactActor'
import TodoListActor from '../actors/domain/TodoListActor'
import { After, defineParameterType, setWorldConstructor } from 'cucumber'
import TodoList from '../../src/server/TodoList'
import makeUseHttpTodoList from '../../src/client/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from '../../src/client/makeHttpAddTodo'
import makeExpressApp from '../../src/server/makeExpressApp'
import WebDriverActor from '../actors/webdriver/WebDriverActor'
import Server from '../../src/server/Server'
import makeWebpackMiddleware from '../../src/server/makeWebpackMiddleware'
import { promisify } from 'util'
import makeStaticMiddleware from '../../src/server/makeStaticMiddleware'
import makeActorElement from '../actors/react/makeActorElement'
import { RequestListener } from 'http'

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName: string): IActor {
    // this is an instance of TodoWorld
    return this.getActorByName(actorName)
  },
})

class TodoWorld {
  private readonly actorsByName = new Map<string, IActor>()
  private readonly closers: Array<() => Promise<void>> = []
  private server?: Server

  async getActorByName(name: string): Promise<IActor> {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        actor = await this.makeReactActor(name)
      } else if (process.env.ASSEMBLY === 'react-http') {
        actor = await this.makeReactHttpActor(name)
      } else if (process.env.ASSEMBLY === 'webdriver') {
        actor = await this.makeLocalWebDriverActor()
      } else if (process.env.ASSEMBLY === 'cbt') {
        actor = await this.makeCbtWebDriverActor()
      } else {
        actor = new TodoListActor()
      }
      this.actorsByName.set(name, actor)
    }
    return actor
  }

  async close() {
    await Promise.all(this.closers.map(close => close()))
  }

  private async startServer(requestListener: RequestListener): Promise<void> {
    if (this.server) {
      return
    }
    this.server = new Server(requestListener)
    await this.server.listen(0)
    this.closers.push(this.server.close.bind(this.server))
  }

  private async makeReactActor(name: string): Promise<IActor> {
    const element = await makeActorElement(name)
    const todoList = new TodoList()
    const useTodoList = () => todoList.getTodos()
    const addTodo = async (todo: string) => todoList.add(todo)
    return new ReactActor(element, useTodoList, addTodo)
  }

  private async makeReactHttpActor(name: string): Promise<IActor> {
    const app = makeExpressApp()
    await this.startServer(app)
    const element = await makeActorElement(name)
    const baseURL = new URL(`http://localhost:${this.server!.port}`)
    const useTodoList = makeUseHttpTodoList(baseURL)
    const addTodo = makeHttpAddTodo(baseURL)
    return new ReactActor(element, useTodoList, addTodo)
  }

  private async makeLocalWebDriverActor(): Promise<IActor> {
    const webpackMiddleware = makeWebpackMiddleware()
    this.closers.push(promisify(webpackMiddleware.close.bind(webpackMiddleware)))
    const app = makeExpressApp(webpackMiddleware, makeStaticMiddleware())
    await this.startServer(app)

    const browser = new webdriver.Builder().forBrowser('firefox').build()

    await browser.get(`http://localhost:${this.server!.port}`)
    this.closers.push(browser.close.bind(browser))
    return new WebDriverActor(browser)
  }

  private async makeCbtWebDriverActor(): Promise<IActor> {
    const webpackMiddleware = makeWebpackMiddleware()
    this.closers.push(promisify(webpackMiddleware.close.bind(webpackMiddleware)))
    const app = makeExpressApp(webpackMiddleware, makeStaticMiddleware())
    await this.startServer(app)

    await this.startCbtTunnel()

    // See https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/
    const cbtHub = 'http://hub.crossbrowsertesting.com/wd/hub'
    const capabilities = {
      name: 'TODO app',
      build: '1.0',
      platform: 'Windows 10',
      // eslint-disable-next-line @typescript-eslint/camelcase
      screen_resolution: '1366x768',
      // eslint-disable-next-line @typescript-eslint/camelcase
      record_video: 'true',
      // eslint-disable-next-line @typescript-eslint/camelcase
      record_network: 'true',
      // https://help.crossbrowsertesting.com/selenium-testing/getting-started/crossbrowsertesting-automation-capabilities/
      browserName: 'chrome',
      version: '80',
      username: process.env['CBT_USERNAME'],
      password: process.env['CBT_AUTHKEY'],
    }
    const browser = new webdriver.Builder()
      .usingServer(cbtHub)
      .withCapabilities(capabilities)
      .build()

    await browser.get(`http://localhost:${this.server!.port}`)
    this.closers.push(browser.close.bind(browser))
    return new WebDriverActor(browser)
  }

  private async startCbtTunnel() {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cbt = require('cbt_tunnels')
    const cbtStart = promisify(cbt.start.bind(cbt))
    await cbtStart({ username: process.env['CBT_USERNAME'], authkey: process.env['CBT_AUTHKEY'] })
    const cbtStop = promisify(cbt.stop.bind(cbt))
    // @ts-ignore
    this.closers.push(cbtStop)
  }
}

setWorldConstructor(TodoWorld)

After(function() {
  this.close()
})
