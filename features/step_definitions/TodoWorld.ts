import webdriver from 'selenium-webdriver'
import IActor from '../../src/IActor'
import ReactActor from '../../src/ReactActor'
import TodoListActor from '../../src/TodoListActor'
import { defineParameterType, setWorldConstructor } from 'cucumber'
import TodoList from '../../src/TodoList'
import makeUseHttpTodoList from '../../src/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from '../../src/hooks/makeHttpAddTodo'
import makeExpressApp from '../../src/server/makeExpressApp'
import http from 'http'
import { promisify } from 'util'
import { AddressInfo } from 'net'
import WebDriverActor from '../../src/WebDriverActor'

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

  async getActorByName(name: string): Promise<IActor> {
    let actor = this.actorsByName.get(name)
    if (actor === undefined) {
      if (process.env.ASSEMBLY === 'react') {
        actor = this.makeReactActor()
      } else if (process.env.ASSEMBLY === 'react-http') {
        actor = await this.makeReactHttpActor()
      } else if (process.env.ASSEMBLY === 'webdriver') {
        actor = await this.makeWebDriverActor()
      } else {
        actor = new TodoListActor()
      }
      this.actorsByName.set(name, actor)
    }
    return actor
  }

  private makeReactActor(): IActor {
    const todoList = new TodoList()
    const useTodoList: UseTodoList = () => todoList.getTodos()
    const useAddTodo: AddTodo = async (todo: string) => todoList.add(todo)
    return new ReactActor(useTodoList, useAddTodo)
  }

  private async makeReactHttpActor(): Promise<IActor> {
    const app = makeExpressApp()
    const server = http.createServer(app)
    const listen = promisify(server.listen.bind(server))
    await listen(0)
    const port = (server.address() as AddressInfo).port
    const baseURL = new URL(`http://localhost:${port}`)
    const useTodoList = makeUseHttpTodoList(baseURL)
    const addTodo = makeHttpAddTodo(baseURL)
    return new ReactActor(useTodoList, addTodo)
  }

  private async makeWebDriverActor(): Promise<IActor> {
    const browser = new webdriver.Builder().forBrowser('firefox').build()
    await browser.get('http://localhost:3000')
    return new WebDriverActor(browser)
  }
}

setWorldConstructor(TodoWorld)