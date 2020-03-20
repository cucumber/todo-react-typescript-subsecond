import IActor from '../IActor'
import { By, Key, ThenableWebDriver } from 'selenium-webdriver'
import { JSDOM } from 'jsdom'
import getTodosFromDom from '../dom/getTodosFromDom'

export default class WebDriverActor implements IActor {
  private doc?: HTMLElement
  constructor(private readonly browser: ThenableWebDriver) {}

  async addTodo(todo: string): Promise<void> {
    await this.updateDoc()
    const todoCount = this.getTodos().length

    const input = await this.browser.findElement(By.css('input'))
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
    if (this.doc === undefined) {
      throw new Error('No doc')
    }
    return getTodosFromDom(this.doc)
  }
}
