import { microdata } from '@cucumber/microdata'
import { ItemList } from 'schema-dts'

export default function getTodosFromDom(htmlElement: HTMLElement) {
  const itemList = microdata('http://schema.org/ItemList', htmlElement) as ItemList
  if (!itemList) return []
  if (itemList.itemListElement === undefined) return []
  if (typeof itemList.itemListElement === 'string') return [itemList.itemListElement]
  return itemList.itemListElement as string[]
}
