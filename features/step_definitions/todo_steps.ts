import { Given } from 'cucumber'

Given('there is already {int} todo', function(todoCount: number) {
  const todoList = new TodoList()
  for (let n = 0; n < todoCount; n++) {
    todoList.add(`TODO #${n + 1}`)
  }
})
