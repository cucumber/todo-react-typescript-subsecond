import { Before, Given, Then, When } from 'cucumber'
import assert from 'assert'
import TodoList from '../../src/TodoList'
import ITodoList from '../../src/ITodoList'
import ReactTodoList from '../../src/ReactTodoList'

let todoList: ITodoList

Before(function() {
  if (process.env.ASSEMBLY === 'react') {
    todoList = new ReactTodoList()
  } else {
    todoList = new TodoList()
  }
})

Given('Sam has already added {int} todo', function(todoCount: number) {
  for (let n = 0; n < todoCount; n++) {
    todoList.add(`TODO #${n + 1}`)
  }
})

When('Sam adds {string}', function(todo: string) {
  todoList.add(todo)
})

Then('Sam should see {string} at the top', function(expectedTodo: string) {
  // Write code here that turns the phrase above into concrete actions
  const secondTodo = todoList.getTodos()[0]
  assert.strictEqual(secondTodo, expectedTodo)
})
