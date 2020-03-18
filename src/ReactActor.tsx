import { render } from 'react-dom'
// @ts-ignore
import { findByPlaceholderText, fireEvent, waitFor } from '@testing-library/dom'
import IActor from './IActor'
import TodoApp from './components/TodoApp'
import React from 'react'
import { microdata } from '@cucumber/microdata'
import { ItemList } from 'schema-dts'
import assert from 'assert'

export default class ReactActor implements IActor {
  private readonly element = document.createElement('div')

  constructor(useTodoList: UseTodoList, addTodo: AddTodo) {
    document.body.appendChild(this.element)
    render(<TodoApp useTodoList={useTodoList} addTodo={addTodo} />, this.element)
  }

  async addTodo(todo: string): Promise<void> {
    const input = await findByPlaceholderText(this.element, 'What needs to be done?')
    const todoCount = this.getTodos().length
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
    await waitFor(() => assert.equal(this.getTodos().length, todoCount + 1), {
      container: this.element,
    })
  }

  getTodos(): ReadonlyArray<string> {
    const itemList = microdata('http://schema.org/ItemList', this.element) as ItemList
    if (itemList.itemListElement === undefined) return []
    if (typeof itemList.itemListElement === 'string') return [itemList.itemListElement]
    return itemList.itemListElement as string[]
  }
}
