import React, { useState } from 'react'

const ENTER_KEY = 13

interface IProps {
  useTodoList: UseTodoList
  useAddTodo: UseAddTodo
}

const TodoApp: React.FunctionComponent<IProps> = ({ useTodoList, useAddTodo }) => {
  const [newTodo, setNewTodo] = useState('')
  const todoList = useTodoList()
  const addTodo = useAddTodo()

  if (todoList === null) {
    return <div>Loading...</div>
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodo(event.target.value)
  }

  function onKeydown(event: React.KeyboardEvent) {
    if (event.keyCode == ENTER_KEY) {
      addTodo(newTodo)
      setNewTodo('')
    }
  }

  return (
    <header>
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={onChange}
        onKeyDown={onKeydown}
      />
      <ul itemScope itemType="http://schema.org/ItemList">
        {todoList.map((todo, n) => (
          <li key={n} itemProp="itemListElement" itemType="http://schema.org/Text">
            {todo}
          </li>
        ))}
      </ul>
    </header>
  )
}

export default TodoApp
