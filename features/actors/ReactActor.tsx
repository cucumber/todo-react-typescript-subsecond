import { render } from 'react-dom'
// @ts-ignore
import { findByPlaceholderText, fireEvent, waitFor } from '@testing-library/dom'
import IActor from './IActor'
import TodoApp from '../../src/client/components/TodoApp'
import React from 'react'
import assert from 'assert'
import getTodosFromDom from './getTodosFromDom'

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
    return getTodosFromDom(this.element)
  }
}
