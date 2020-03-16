import { render } from 'react-dom'
import { getByPlaceholderText } from '@testing-library/dom'
import IActor from './IActor'
import TodoApp from './components/TodoApp'
import React from 'react'
import { microdata } from '@cucumber/microdata'
import { ItemList, Text } from 'schema-dts'

export default class ReactActor implements IActor {
  private readonly element = document.createElement('div')

  constructor() {
    document.body.appendChild(this.element)
    render(<TodoApp />, this.element)
  }

  addTodo(todo: string): void {
    const input = getByPlaceholderText(
      document.documentElement,
      'What needs to be done?'
    ) as HTMLInputElement
    input.value = todo
  }

  getTodos(): ReadonlyArray<string> {
    const itemList = microdata(
      'http://schema.org/ItemList',
      this.element
    ) as ItemList
    return itemList.itemListElement as Text[]
  }
}
