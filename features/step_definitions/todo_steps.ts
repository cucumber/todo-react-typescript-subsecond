import { Before, Given, When } from 'cucumber'
import TodoList from '../../src/TodoList'

Before(function() {
  this.todoList = new TodoList()
})

Given('there is already {int} todo', function(todoCount: number) {
  for (let n = 0; n < todoCount; n++) {
    this.todoList.add(`TODO #${n + 1}`)
  }
})

When('I add {string}', function(todo: string) {
  this.todoList.add(todo)
})
