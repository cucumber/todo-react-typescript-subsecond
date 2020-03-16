import { Before, Given, When, Then } from 'cucumber'
import assert from 'assert'
import TodoList from '../../src/TodoList'
import ITodoList from '../../src/ITodoList'

let todoList: ITodoList

class ReactTodoList implements ITodoList {
  add(todo: string): void {
    throw new Error('not implemented')
  }

  getTodos(): ReadonlyArray<string> {
    throw new Error('not implemented')
  }
}

Before(function() {
  if (process.env.ASSEMBLY === 'react') {
    todoList = new ReactTodoList()
  } else {
    todoList = new TodoList()
  }
})

Given('there is already {int} todo', function(todoCount: number) {
  for (let n = 0; n < todoCount; n++) {
    todoList.add(`TODO #${n + 1}`)
  }
})

When('I add {string}', function(todo: string) {
  todoList.add(todo)
})

Then('the text of the 2nd todo should be {string}', function(
  expectedTodo: string
) {
  // Write code here that turns the phrase above into concrete actions
  const secondTodo = todoList.getTodos()[1]
  assert.strictEqual(secondTodo, expectedTodo)
})
