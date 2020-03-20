import fs from 'fs'
import { promisify } from 'util'
const readFile = promisify(fs.readFile)

export default async function makeFakeBrowserElement(name: string): Promise<HTMLElement> {
  const div = document.createElement('div')
  div.innerHTML = await readFile(__dirname + '/fake-browser.html', { encoding: 'utf-8' })
  div.querySelector('span.cucumber-electron-fake-browser-title')!.innerHTML = name
  document.body.appendChild(div)
  return div
}
