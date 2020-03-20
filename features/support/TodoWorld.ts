import IActor from '../actors/IActor'
import ReactActor from '../actors/react/ReactActor'
import TodoListActor from '../actors/domain/TodoListActor'
import { After, AfterAll, defineParameterType, setWorldConstructor } from 'cucumber'
import TodoList from '../../src/server/TodoList'
import makeUseHttpTodoList from '../../src/client/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from '../../src/client/makeHttpAddTodo'
import WebDriverActor from '../actors/webdriver/WebDriverActor'
import Server from '../../src/server/Server'

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
  public static server?: Server

  async getActorByName(name: string): Promise<IActor> {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        actor = await this.makeReactActor(name)
      } else if (process.env.ASSEMBLY === 'react-http') {
        actor = await TodoWorld.makeReactHttpActor(name)
      } else if (process.env.ASSEMBLY === 'webdriver') {
        actor = await this.makeLocalWebDriverActor()
      } else if (process.env.ASSEMBLY === 'cbt') {
        actor = await this.makeCbtWebDriverActor()
      } else {
        actor = new TodoListActor()
      }
      this.actorsByName.set(name, actor)
      await actor.start()
      this.closers.push(actor.close.bind(actor))
    }
    return actor
  }

  async close() {
    await Promise.all(this.closers.map(close => close()))
  }

  private static async startServer(): Promise<void> {
    if (TodoWorld.server) {
      return
    }
    TodoWorld.server = new Server()
    await TodoWorld.server.listen(0)
  }

  private async makeReactActor(name: string): Promise<IActor> {
    const todoList = new TodoList()
    const useTodoList = () => todoList.getTodos()
    const addTodo = async (todo: string) => todoList.add(todo)
    return new ReactActor(name, useTodoList, addTodo)
  }

  private static async makeReactHttpActor(name: string): Promise<IActor> {
    await TodoWorld.startServer()
    const baseURL = new URL(`http://localhost:${TodoWorld.server!.port}`)
    const useTodoList = makeUseHttpTodoList(baseURL)
    const addTodo = makeHttpAddTodo(baseURL)
    return new ReactActor(name, useTodoList, addTodo)
  }

  private async makeLocalWebDriverActor(): Promise<IActor> {
    await TodoWorld.startServer()
    return new WebDriverActor(TodoWorld.server!.port)
  }

  private async makeCbtWebDriverActor(): Promise<IActor> {
    await TodoWorld.startServer()

    // await this.startCbtTunnel()
    //
    // // See https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/
    // const cbtHub = 'http://hub.crossbrowsertesting.com/wd/hub'
    // const capabilities = {
    //   name: 'TODO app',
    //   build: '1.0',
    //   platform: 'Windows 10',
    //   // eslint-disable-next-line @typescript-eslint/camelcase
    //   screen_resolution: '1366x768',
    //   // eslint-disable-next-line @typescript-eslint/camelcase
    //   record_video: 'true',
    //   // eslint-disable-next-line @typescript-eslint/camelcase
    //   record_network: 'true',
    //   // https://help.crossbrowsertesting.com/selenium-testing/getting-started/crossbrowsertesting-automation-capabilities/
    //   browserName: 'chrome',
    //   version: '80',
    //   username: process.env['CBT_USERNAME'],
    //   password: process.env['CBT_AUTHKEY'],
    // }
    // const browser = new webdriver.Builder()
    //   .usingServer(cbtHub)
    //   .withCapabilities(capabilities)
    //   .build()
    return new WebDriverActor(TodoWorld.server!.port)
  }

  // private async startCbtTunnel() {
  //   // @ts-ignore
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const cbt = require('cbt_tunnels')
  //   const cbtStart = promisify(cbt.start.bind(cbt))
  //   await cbtStart({ username: process.env['CBT_USERNAME'], authkey: process.env['CBT_AUTHKEY'] })
  //   const cbtStop = promisify(cbt.stop.bind(cbt))
  //   // @ts-ignore
  //   this.closers.push(cbtStop)
  // }
}

setWorldConstructor(TodoWorld)

After(function() {
  this.close()
})

AfterAll(async function() {
  if (WebDriverActor.browser) {
    await WebDriverActor.browser.close()
    try {
      await WebDriverActor.browser.quit()
    } catch (ignore) {
      // no-op
    }
  }
  if (TodoWorld.server) {
    await TodoWorld.server.close()
  }
})
