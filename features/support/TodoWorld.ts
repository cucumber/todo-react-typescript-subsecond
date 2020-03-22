import IActor from '../actors/IActor'
import ReactActor from '../actors/react/ReactActor'
import TodoListActor from '../actors/domain/TodoListActor'
import { After, AfterAll, Before, defineParameterType, setWorldConstructor } from 'cucumber'
import TodoList from '../../src/server/TodoList'
import WebDriverActor from '../actors/webdriver/WebDriverActor'
import Server from '../../src/server/Server'
import webdriver, { ThenableWebDriver } from 'selenium-webdriver'

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName: string): IActor {
    // this is an instance of TodoWorld
    return this.getActorByName(actorName)
  },
})

const sharedTodoList = new TodoList()
let sharedServer: Server | null = null
let sharedBrowser: ThenableWebDriver | null = null

class TodoWorld {
  private readonly todoList = sharedTodoList
  private readonly actorsByName = new Map<string, IActor>()
  private readonly closers: Array<() => Promise<void>> = []

  async getActorByName(name: string): Promise<IActor> {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        actor = await ReactActor.createFromTodoList(name, sharedTodoList)
      } else if (process.env.ASSEMBLY === 'react-http') {
        actor = await ReactActor.createFromServer(name, await startSharedServer())
      } else if (process.env.ASSEMBLY === 'webdriver') {
        actor = await WebDriverActor.createFromServer(
          startSharedBrowser(),
          await startSharedServer()
        )
      } else {
        actor = new TodoListActor()
      }
      this.actorsByName.set(name, actor)
      await actor.start()
      this.closers.push(actor.stop.bind(actor))
    }
    return actor
  }

  async start() {
    this.todoList.clear()
  }

  async stop() {
    await Promise.all(this.closers.map(close => close()))
  }
}

async function startSharedServer(): Promise<Server> {
  if (sharedServer === null) {
    sharedServer = new Server(sharedTodoList)
    await sharedServer.listen(0)
  }
  return sharedServer
}

function startSharedBrowser(): ThenableWebDriver {
  if (sharedBrowser === null) {
    sharedBrowser = new webdriver.Builder().forBrowser('firefox').build()
  }
  return sharedBrowser
}

setWorldConstructor(TodoWorld)

Before(async function() {
  await this.start()
})

After(async function() {
  await this.stop()
})

AfterAll(async function() {
  if (sharedBrowser) {
    await sharedBrowser.close()
    try {
      await sharedBrowser.quit()
    } catch (ignore) {
      // no-op
    }
  }
  if (sharedServer) {
    await sharedServer.close()
  }
})
