import { WebDriver } from 'selenium-webdriver'
import { promisify } from 'util'

export default async function quitWebDriver(browser: WebDriver) {
  await browser.close()
  try {
    await browser.quit()
  } catch (ignore) {
    // no-op
  }
  if (process.env.CBT === '1') {
    await stopCbtTunnel()
  }
}

async function stopCbtTunnel() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cbt = require('cbt_tunnels')
  const cbtStop = promisify(cbt.stop.bind(cbt))
  await cbtStop()
}
