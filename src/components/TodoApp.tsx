import React, { useState } from 'react'

const ENTER_KEY = 13

interface IProps {
  useTodoList: UseTodoList
  addTodo: AddTodo
}

const TodoApp: React.FunctionComponent<IProps> = ({ useTodoList, addTodo }) => {
  const [busy, setBusy] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const todoList = useTodoList()

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodo(event.target.value)
  }

  function onKeydown(event: React.KeyboardEvent) {
    if (event.keyCode == ENTER_KEY) {
      // TODO: proper error handling
      setNewTodo('')
      setBusy(true)
      addTodo(newTodo)
        .then(() => setBusy(false))
        .catch((error: Error) => console.error(error.stack))
    }
  }

  return (
    <header>
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder={busy ? 'Please wait' : 'What needs to be done?'}
        value={newTodo}
        onChange={onChange}
        onKeyDown={onKeydown}
      />
      {todoList === null ? (
        <div>Loading...</div>
      ) : (
        <ul itemScope itemType="http://schema.org/ItemList">
          {todoList.map((todo, n) => (
            <li key={n} itemProp="itemListElement" itemType="http://schema.org/Text">
              {todo}
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default TodoApp
