import { Given, Then, When } from 'cucumber'
import assert from 'assert'
import IActor from '../actors/IActor'

Given('{actor} has already added {int} todo(s)', async function(actor: IActor, todoCount: number) {
  for (let n = 0; n < todoCount; n++) {
    await actor.addTodo(`SOME TODO #${n + 1}`)
  }
})

When('{actor} adds {string}', async function(actor: IActor, todo: string) {
  await actor.addTodo(todo)
})

Then('{actor} should see {string} at the top', async function(actor: IActor, expectedTodo: string) {
  const topTodo = (await actor.getTodos())[0]
  assert.strictEqual(topTodo, expectedTodo)
})
