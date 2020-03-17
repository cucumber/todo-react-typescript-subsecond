import { render } from 'react-dom'
import {
  fireEvent,
  findByPlaceholderText,
  findByTestId,
  waitForDomChange,
} from '@testing-library/dom'
import IActor from './IActor'
import TodoApp from './components/TodoApp'
import React from 'react'
import { microdata } from '@cucumber/microdata'
import { ItemList, Text } from 'schema-dts'

export default class ReactActor implements IActor {
  private readonly element = document.createElement('div')

  constructor(useTodoList: UseTodoList, useAddTodo: AddTodo) {
    document.body.appendChild(this.element)
    render(<TodoApp useTodoList={useTodoList} addTodo={useAddTodo} />, this.element)
  }

  async addTodo(todo: string): Promise<void> {
    const input = await findByPlaceholderText(this.element, 'What needs to be done?')
    const todos = await findByTestId(this.element, 'todos')
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
    await waitForDomChange({ container: todos })
  }

  getTodos(): ReadonlyArray<string> {
    const itemList = microdata('http://schema.org/ItemList', this.element) as ItemList
    if (itemList.itemListElement === undefined) return []
    return itemList.itemListElement as Text[]
  }
}
