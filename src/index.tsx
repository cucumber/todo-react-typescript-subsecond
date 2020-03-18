import { render } from 'react-dom'
import TodoApp from './components/TodoApp'
import React from 'react'
import makeUseHttpTodoList from './hooks/makeUseHttpTodoList'
import makeHttpAddTodo from './hooks/makeHttpAddTodo'

const baseURL = new URL(`${window.location.protocol}//${window.location.host}`)
const useTodoList = makeUseHttpTodoList(baseURL)
const addTodo = makeHttpAddTodo(baseURL)
render(<TodoApp useTodoList={useTodoList} addTodo={addTodo} />, document.getElementById('app'))
