import { Given, Then, When } from 'cucumber'
import assert from 'assert'
import IActor from '../actors/IActor'
import TodoList from '../../src/server/TodoList'

Given('there is/are already {int} todo(s)', async function (todoCount: number) {
  const todoList: TodoList = this.todoList
  for (let n = 0; n < todoCount; n++) {
    todoList.add(`TODO ${n + 1}`)
  }
})

When('{actor} adds {string}', async function (actor: IActor, todo: string) {
  await actor.addTodo(todo)
})

Then('{actor} should see {string} at the top', function (actor: IActor, expectedTodo: string) {
  const topTodo = actor.getTodos()![0]
  assert.strictEqual(topTodo, expectedTodo)
})
