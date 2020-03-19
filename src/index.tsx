import { render } from 'react-dom'
import TodoApp from './client/components/TodoApp'
import React from 'react'
import makeUseHttpTodoList from './client/hooks/makeUseHttpTodoList'
import makeHttpAddTodo from './client/makeHttpAddTodo'

const baseURL = new URL(`${window.location.protocol}//${window.location.host}`)
const useTodoList = makeUseHttpTodoList(baseURL)
const addTodo = makeHttpAddTodo(baseURL)
render(<TodoApp useTodoList={useTodoList} addTodo={addTodo} />, document.getElementById('app'))
