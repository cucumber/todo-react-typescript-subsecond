import { render, unmountComponentAtNode } from 'react-dom'
import { fireEvent, waitFor } from '@testing-library/dom'
import IActor from '../IActor'
import TodoApp from '../../../src/client/components/TodoApp'
import React from 'react'
import assert from 'assert'
import getTodosFromDom from '../dom/getTodosFromDom'
import makeFakeBrowserElement from './makeFakeBrowserElement'
import TodoList from '../../../src/server/TodoList'
import Server from '../../../src/server/Server'
import makeUseHttpTodoList from '../../../src/client/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from '../../../src/client/makeHttpAddTodo'
import makeUseEventSourceDisconnected from '../../../src/client/hooks/makeUseEventSourceDisconnected'
import { AddTodo, UseDisconnected, UseTodoList } from '../../../src/client/components/types'

export default class ReactActor implements IActor {
  private fakeBrowserErowserElement?: HTMLElement
  private appElement?: HTMLElement

  static createFromTodoList(name: string, todoList: TodoList) {
    const useDisconnected = () => false
    const useTodoList = () => todoList.getTodos()
    const addTodo = async (todo: string) => todoList.add(todo)
    return new this(`${name} (No server)`, useDisconnected, useTodoList, addTodo)
  }

  static createFromServer(name: string, server: Server) {
    const baseURL = new URL(`http://localhost:${server.port}`)
    const eventSource = new EventSource(new URL('/eventsource', baseURL).toString())
    const useDisconnected = makeUseEventSourceDisconnected(eventSource)
    const useTodoList = makeUseHttpTodoList(baseURL, eventSource)
    const addTodo = makeHttpAddTodo(baseURL)
    return new ReactActor(`${name} - ${baseURL}`, useDisconnected, useTodoList, addTodo)
  }

  constructor(
    private readonly title: string,
    private readonly useDisconnected: UseDisconnected,
    private readonly useTodoList: UseTodoList,
    private readonly addTodoFn: AddTodo
  ) {}

  async addTodo(todo: string): Promise<void> {
    const input = await waitFor(this.inputEnabled(), { container: this.appElement })
    const todoCount = this.getTodos()!.length
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
    await waitFor(() => assert.equal(this.getTodos()!.length, todoCount + 1), {
      container: this.appElement,
    })
  }

  getTodos(): ReadonlyArray<string> | null {
    return getTodosFromDom(this.appElement!)
  }

  async start(): Promise<void> {
    addStylesheet()
    this.fakeBrowserErowserElement = await makeFakeBrowserElement(this.title)
    this.appElement = this.fakeBrowserErowserElement.querySelector(
      'div.cucumber-electron-fake-browser-content'
    )! as HTMLElement

    render(
      <TodoApp
        useDisconnected={this.useDisconnected}
        useTodoList={this.useTodoList}
        addTodo={this.addTodoFn}
      />,
      this.appElement
    )
    await waitFor(() => assert.notEqual(this.getTodos(), null), { container: this.appElement })
  }

  async stop(): Promise<void> {
    if (process.env.KEEP_DOM == '1') {
      return
    }
    // We have to explicitly unmount the React App to trigger the useEffect cleanup functions
    assert(unmountComponentAtNode(this.appElement!))
    this.fakeBrowserErowserElement!.remove()
  }

  inputEnabled() {
    return () => {
      const input = this.appElement!.querySelector('input')!
      if (input!.disabled) {
        throw new Error('<input> not enabled')
      }
      return input
    }
  }
}

let stylesheetAdded = false
function addStylesheet() {
  if (stylesheetAdded) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = __dirname + '/../../../public/todo.css'
  document.head.appendChild(link)
  stylesheetAdded = true
}
