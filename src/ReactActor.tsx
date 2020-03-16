import { render } from 'react-dom'
import { getByPlaceholderText, fireEvent } from '@testing-library/dom'
import IActor from './IActor'
import TodoApp from './components/TodoApp'
import React from 'react'
import { microdata } from '@cucumber/microdata'
import { ItemList, Text } from 'schema-dts'

export default class ReactActor implements IActor {
  private readonly element = document.createElement('div')

  constructor(useTodoList: UseTodoList, useAddTodo: UseAddTodo) {
    document.body.appendChild(this.element)
    render(<TodoApp useTodoList={useTodoList} useAddTodo={useAddTodo} />, this.element)
  }

  async addTodo(todo: string): Promise<void> {
    const input = getByPlaceholderText(this.element, 'What needs to be done?') as HTMLInputElement
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
  }

  getTodos(): ReadonlyArray<string> {
    const itemList = microdata('http://schema.org/ItemList', this.element) as ItemList
    return itemList.itemListElement as Text[]
  }
}
