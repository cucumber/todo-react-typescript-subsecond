import IActor from '../IActor'
import { By, Key, ThenableWebDriver } from 'selenium-webdriver'
import { JSDOM } from 'jsdom'
import getTodosFromDom from '../dom/getTodosFromDom'
import Server from '../../../src/server/Server'

export default class WebDriverActor implements IActor {
  private doc?: HTMLElement

  static async createFromServer(browser: ThenableWebDriver, server: Server) {
    const startURL = `http://localhost:${server.port}`
    return new WebDriverActor(browser, startURL)
  }

  constructor(private readonly browser: ThenableWebDriver, private readonly startURL: string) {}

  async addTodo(todo: string): Promise<void> {
    await this.updateDoc()
    const todoCount = this.getTodos().length

    const input = await this.browser.findElement(
      By.css("input[placeholder='What needs to be done?']")
    )
    await input.sendKeys(todo)
    await input.sendKeys(Key.RETURN)

    await this.browser.wait(async () => {
      await this.updateDoc()
      return this.getTodos().length === todoCount + 1
    })
  }

  private async updateDoc() {
    const html = await this.browser.getPageSource()
    this.doc = new JSDOM(html).window.document.documentElement
  }

  getTodos(): ReadonlyArray<string> {
    return getTodosFromDom(this.doc!)
  }

  async start(): Promise<void> {
    await this.browser.get(this.startURL)
    // await new Promise(resolve => setTimeout(resolve, 1000))
  }

  stop(): Promise<void> {
    // We're not closing the browser here. Instead we're reusing a shared instance to speed up our scenarios.
    // The shared browser is closed in the AfterAll hook defined in TodoWorld
    return Promise.resolve()
  }
}
