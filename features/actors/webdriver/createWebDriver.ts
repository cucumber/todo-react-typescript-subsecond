import webdriver, { WebDriver } from 'selenium-webdriver'
import capabilities from './capabilities'
import { promisify } from 'util'

export default async function createWebDriver(): Promise<WebDriver> {
  const browserName = process.env.BROWSER || 'firefox'
  if (process.env.CBT === '1') {
    const username = process.env['CBT_USERNAME']!
    const authkey = process.env['CBT_AUTHKEY']!
    await startCbtTunnel(username, authkey)

    const caps = capabilities(browserName)
    // @ts-ignore
    caps.username = username
    // @ts-ignore
    caps.password = authkey

    return new webdriver.Builder()
      .usingServer(`http://hub.crossbrowsertesting.com/wd/hub`)
      .withCapabilities(caps)
      .build()
  } else {
    return new webdriver.Builder().forBrowser(browserName).build()
  }
}

async function startCbtTunnel(username: string, authkey: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cbt = require('cbt_tunnels')
  const cbtStart = promisify(cbt.start.bind(cbt))
  await cbtStart({ username, authkey })
}
