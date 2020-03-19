import IActor from './IActor'
import { By, ThenableWebDriver, Key } from 'selenium-webdriver'
import { JSDOM } from 'jsdom'
import { microdata } from '@cucumber/microdata'
import { ItemList } from 'schema-dts'

export default class WebDriverActor implements IActor {
  private doc?: HTMLElement
  constructor(private readonly browser: ThenableWebDriver) {}

  async addTodo(todo: string): Promise<void> {
    const input = await this.browser.findElement(By.css('input'))
    await input.sendKeys(todo)
    await input.sendKeys(Key.RETURN)

    // const input = await findByPlaceholderText(this.element, 'What needs to be done?')
    // const todoCount = this.getTodos().length
    // fireEvent.change(input, { target: { value: todo } })
    // fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
    // await waitFor(() => assert.equal(this.getTodos().length, todoCount + 1), {
    //   container: this.element,
    // })
    await new Promise(resolve => setTimeout(resolve, 1000))
    const html = await this.browser.getPageSource()
    this.doc = new JSDOM(html).window.document.documentElement
  }

  getTodos(): ReadonlyArray<string> {
    if (this.doc === undefined) {
      throw new Error('No doc')
    }
    const itemList = microdata('http://schema.org/ItemList', this.doc) as ItemList
    if (itemList.itemListElement === undefined) return []
    if (typeof itemList.itemListElement === 'string') return [itemList.itemListElement]
    return itemList.itemListElement as string[]
  }
}
