import { WebDriver } from 'selenium-webdriver'
import IActor from '../actors/IActor'
import ReactActor from '../actors/react/ReactActor'
import TodoListActor from '../actors/domain/TodoListActor'
import {
  After,
  AfterAll,
  Before,
  defineParameterType,
  setDefaultTimeout,
  setWorldConstructor,
} from 'cucumber'
import TodoList from '../../src/server/TodoList'
import WebDriverActor from '../actors/webdriver/WebDriverActor'
import Server from '../../src/server/Server'
import createWebDriver from '../actors/webdriver/createWebDriver'
import quitWebDriver from '../actors/webdriver/quitWebDriver'

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName: string): IActor {
    // this is an instance of TodoWorld
    return this.getActorByName(actorName)
  },
})

let sharedBrowser: WebDriver | null = null

class TodoWorld {
  private readonly todoList = new TodoList()
  private readonly actorsByName = new Map<string, IActor>()
  private readonly stoppers: Array<() => Promise<void>> = []

  async getActorByName(name: string): Promise<IActor> {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        actor = await ReactActor.createFromTodoList(name, this.todoList)
      } else if (process.env.ASSEMBLY === 'react-http') {
        actor = await ReactActor.createFromServer(name, await this.startServer())
      } else if (process.env.ASSEMBLY === 'webdriver') {
        const browser = await startSharedBrowser()
        actor = await WebDriverActor.createFromServer(browser, await this.startServer())
      } else {
        actor = new TodoListActor()
      }
      this.actorsByName.set(name, actor)
      await actor.start()
      this.stoppers.push(actor.stop.bind(actor))
    }
    return actor
  }

  async startServer(): Promise<Server> {
    const server = new Server(this.todoList)
    await server.listen(0)
    this.stoppers.push(server.close.bind(server))
    return server
  }

  async start() {
    this.todoList.clear()
  }

  async stop() {
    for (const stop of this.stoppers.reverse()) {
      await stop()
    }
  }
}

async function startSharedBrowser(): Promise<WebDriver> {
  if (sharedBrowser === null) {
    sharedBrowser = await createWebDriver()
  }
  return sharedBrowser
}

setWorldConstructor(TodoWorld)

if (process.env.ASSEMBLY === 'webdriver') {
  setDefaultTimeout(15 * 1000)
}

Before(async function () {
  await this.start()
})

After(async function () {
  await this.stop()
})

AfterAll(async function () {
  if (sharedBrowser) {
    await quitWebDriver(sharedBrowser)
  }
})
