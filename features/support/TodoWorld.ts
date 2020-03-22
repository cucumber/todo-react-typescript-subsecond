import IActor from '../actors/IActor'
import ReactActor from '../actors/react/ReactActor'
import TodoListActor from '../actors/domain/TodoListActor'
import { After, AfterAll, Before, defineParameterType, setWorldConstructor } from 'cucumber'
import TodoList from '../../src/server/TodoList'
import makeUseHttpTodoList from '../../src/client/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from '../../src/client/makeHttpAddTodo'
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

const todoList = new TodoList()

let server: Server
let browser: ThenableWebDriver | null = null

class TodoWorld {
  private readonly todoList = todoList
  private readonly actorsByName = new Map<string, IActor>()
  private readonly closers: Array<() => Promise<void>> = []

  async getActorByName(name: string): Promise<IActor> {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        actor = await this.makeReactActor(name)
      } else if (process.env.ASSEMBLY === 'react-http') {
        actor = await this.makeReactHttpActor(name)
      } else if (process.env.ASSEMBLY === 'webdriver') {
        actor = await this.makeWebDriverActor()
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

  private async makeReactActor(name: string): Promise<IActor> {
    const useTodoList = () => this.todoList.getTodos()
    const addTodo = async (todo: string) => this.todoList.add(todo)
    return new ReactActor(name, useTodoList, addTodo)
  }

  private async makeReactHttpActor(name: string): Promise<IActor> {
    await startServer()
    const baseURL = new URL(`http://localhost:${server.port}`)
    const useTodoList = makeUseHttpTodoList(baseURL)
    const addTodo = makeHttpAddTodo(baseURL)
    return new ReactActor(name, useTodoList, addTodo)
  }

  private async makeWebDriverActor(): Promise<IActor> {
    await startServer()
    if (browser === null) {
      browser = new webdriver.Builder().forBrowser('firefox').build()
    }
    const startURL = `http://localhost:${server.port}`

    return new WebDriverActor(browser, startURL)
  }
}

async function startServer(): Promise<void> {
  if (!server) {
    server = new Server(todoList)
    await server.listen(0)
  }
}

setWorldConstructor(TodoWorld)

Before(async function() {
  await this.start()
})

After(async function() {
  await this.stop()
})

AfterAll(async function() {
  if (browser) {
    await browser.close()
    try {
      await browser.quit()
    } catch (ignore) {
      // no-op
    }
  }
  if (server) {
    await server.close()
  }
})
