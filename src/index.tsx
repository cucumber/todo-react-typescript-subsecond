import { render } from 'react-dom'
import TodoApp from './client/components/TodoApp'
import React from 'react'
import makeUseHttpTodoList from './client/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from './client/makeHttpAddTodo'
import makeUseEventSourceDisconnected from './client/hooks/makeUseEventSourceDisconnected'

const baseURL = new URL(`${window.location.protocol}//${window.location.host}`)
const eventSource = new EventSource(new URL('/eventsource', baseURL).toString())
const useDisconnected = makeUseEventSourceDisconnected(eventSource)
const useTodoList = makeUseHttpTodoList(baseURL, eventSource)
const addTodo = makeHttpAddTodo(baseURL)
render(
  <TodoApp useDisconnected={useDisconnected} useTodoList={useTodoList} addTodo={addTodo} />,
  document.getElementById('app')
)
