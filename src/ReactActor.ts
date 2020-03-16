import { getByLabelText } from '@testing-library/dom'
import IActor from './IActor'

export default class ReactActor implements IActor {
  addTodo(todo: string): void {
    // TODO: Declare as HTMLInputElement
    const input: any = getByLabelText(document.documentElement, 'new-todo')
    input.value = todo
  }

  getTodos(): ReadonlyArray<string> {
    throw new Error('not implemented')
  }
}
