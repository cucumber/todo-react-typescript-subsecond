import IActor from '../IActor'
import webdriver, { By, Key, ThenableWebDriver } from 'selenium-webdriver'
import { JSDOM } from 'jsdom'
import getTodosFromDom from '../dom/getTodosFromDom'

export default class WebDriverActor implements IActor {
  private doc?: HTMLElement
  public static browser?: ThenableWebDriver

  constructor(private readonly port: number) {}

  async addTodo(todo: string): Promise<void> {
    await this.updateDoc()
    const todoCount = this.getTodos().length

    const input = await WebDriverActor.browser!.findElement(By.css('input'))
    await input.sendKeys(todo)
    await input.sendKeys(Key.RETURN)

    await WebDriverActor.browser!.wait(async () => {
      await this.updateDoc()
      return this.getTodos().length === todoCount + 1
    })
  }

  private async updateDoc() {
    const html = await WebDriverActor.browser!.getPageSource()
    this.doc = new JSDOM(html).window.document.documentElement
  }

  getTodos(): ReadonlyArray<string> {
    return getTodosFromDom(this.doc!)
  }

  async start(): Promise<void> {
    if (WebDriverActor.browser) {
      return
    }
    WebDriverActor.browser = new webdriver.Builder().forBrowser('firefox').build()
    await WebDriverActor.browser.get(`http://localhost:${this.port}`)
  }

  close(): Promise<void> {
    // We're not closing the browser here. Instead we're reusing a shared instance to speed up our scenarios.
    // The shared browser is closed in the AfterAll hook defined in TodoWorld
    return Promise.resolve()
  }
}
