import IActor from '../IActor'
import webdriver, { By, Key, WebDriver } from 'selenium-webdriver'
import { JSDOM } from 'jsdom'
import getTodosFromDom from '../dom/getTodosFromDom'
import Server from '../../../src/server/Server'
import { promisify } from 'util'
import fs from 'fs'
const readFile = promisify(fs.readFile)

export default class WebDriverActor implements IActor {
  private doc?: HTMLElement

  static async createBrowser(): Promise<WebDriver> {
    // https://help.crossbrowsertesting.com/selenium-testing/getting-started/crossbrowsertesting-automation-capabilities/
    const browserName = process.env.BROWSER || 'firefox'
    try {
      const capabilitiesFileName = `${__dirname}/${browserName}.json`
      const capabilitiesJson = await readFile(capabilitiesFileName, {
        encoding: 'utf-8',
      })
      const capabilities = JSON.parse(capabilitiesJson)
      const username = process.env['CBT_USERNAME']
      const authkey = process.env['CBT_AUTHKEY']
      capabilities.username = username
      capabilities.password = authkey

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cbt = require('cbt_tunnels')
      const cbtStart = promisify(cbt.start.bind(cbt))
      await cbtStart({ username, authkey })

      return new webdriver.Builder()
        .usingServer('http://hub.crossbrowsertesting.com/wd/hub')
        .withCapabilities(capabilities)
        .build()
    } catch (ignore) {
      return new webdriver.Builder().forBrowser('firefox').build()
    }
  }

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

  private async updateDoc() {
    const html = await this.browser.getPageSource()
    this.doc = new JSDOM(html).window.document.documentElement
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
}
