import IActor from '../IActor'
import { By, Key, WebDriver } from 'selenium-webdriver'
import { JSDOM } from 'jsdom'
import getTodosFromDom from '../dom/getTodosFromDom'
import Server from '../../../src/server/Server'

export default class WebDriverActor implements IActor {
  private doc?: HTMLElement

  static async createFromServer(browser: WebDriver, server: Server) {
    const startURL = `http://localhost:${server.port}`
    return new WebDriverActor(browser, startURL)
  }

  constructor(private readonly browser: WebDriver, private readonly startURL: string) {}

  async addTodo(todo: string): Promise<void> {
    await this.updateDoc()
    const todoCount = this.getTodos()!.length

    const input = await this.browser.findElement(
      By.css("input[placeholder='What needs to be done?']")
    )
    await input.sendKeys(todo)
    await input.sendKeys(Key.RETURN)

    await this.browser.wait(async () => {
      await this.updateDoc()
      return this.getTodos()!.length === todoCount + 1
    })
  }

  getTodos(): ReadonlyArray<string> | null {
    return getTodosFromDom(this.doc!)
  }

  async start(): Promise<void> {
    await this.browser.get(this.startURL)
    await this.browser.wait(async () => {
      await this.updateDoc()
      return this.getTodos() !== null
    })
  }

  stop(): Promise<void> {
    // We're not closing the browser here. Instead we're reusing a shared instance to speed up our scenarios.
    // The shared browser is closed in the AfterAll hook defined in TodoWorld
    return Promise.resolve()
  }

  private async updateDoc() {
    const html = await this.browser.getPageSource()
    this.doc = new JSDOM(html).window.document.documentElement
  }
}
