import React, { useState } from 'react'
import { AddTodo, UseDisconnected, UseTodoList } from './types'

const ENTER_KEY = 13

interface IProps {
  useDisconnected: UseDisconnected
  useTodoList: UseTodoList
  addTodo: AddTodo
}

const TodoApp: React.FunctionComponent<IProps> = ({ useDisconnected, useTodoList, addTodo }) => {
  const [error, setError] = useState<Error | null>()
  const disconnected = useDisconnected()
  const [newTodo, setNewTodo] = useState('')
  const todoList = useTodoList(setError)

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodo(event.target.value)
  }

  function onKeydown(event: React.KeyboardEvent) {
    if (event.keyCode == ENTER_KEY) {
      setNewTodo('')
      addTodo(newTodo).catch(setError)
    }
  }

  return (
    <div className="todos">
      <header>
        {error && <pre>{error.message}</pre>}
        <pre>{disconnected ? 'connecting...' : 'connected'}</pre>
        <h1>todos</h1>
      </header>
      <section>
        <input
          placeholder={'What needs to be done?'}
          value={newTodo}
          onChange={onChange}
          onKeyDown={onKeydown}
          disabled={disconnected}
        />
        {todoList === null ? (
          <div>Loading...</div>
        ) : (
          <ol itemScope itemType="http://schema.org/ItemList">
            {todoList.map((todo, n) => (
              <li key={n} itemProp="itemListElement" itemType="http://schema.org/Text">
                <label>{todo}</label>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

export default TodoApp
