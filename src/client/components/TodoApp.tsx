import React, { useState } from 'react'

const ENTER_KEY = 13

interface IProps {
  useTodoList: UseTodoList
  addTodo: AddTodo
}

const TodoApp: React.FunctionComponent<IProps> = ({ useTodoList, addTodo }) => {
  const [error, setError] = useState<Error | null>()
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
    <header>
      {error && <pre>{error.message}</pre>}
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder={todoList === null ? 'Please wait' : 'What needs to be done?'}
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
