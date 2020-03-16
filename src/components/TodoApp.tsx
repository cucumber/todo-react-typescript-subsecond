import React from 'react'

const TodoApp: React.FunctionComponent = () => (
  <header>
    <h1>todos</h1>
    <input className="new-todo" placeholder="What needs to be done?" />
    <ul itemScope itemType="http://schema.org/ItemList">
      <li itemProp="itemListElement" itemType="http://schema.org/Text">
        get milk
      </li>
      <li itemProp="itemListElement" itemType="http://schema.org/Text">
        TODO #1
      </li>
    </ul>
  </header>
)

export default TodoApp
