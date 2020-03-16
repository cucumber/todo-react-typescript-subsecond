import ITodoList from './ITodoList'
import { getByLabelText } from '@testing-library/dom'

export default class ReactTodoList implements ITodoList {
  add(todo: string): void {
    // TODO: Declare as HTMLInputElement
    const input: any = getByLabelText(document.documentElement, 'new-todo')
    input.value = todo
  }

  getTodos(): ReadonlyArray<string> {
    throw new Error('not implemented')
  }
}
