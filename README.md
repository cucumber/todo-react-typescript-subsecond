# todo-react-typescript-subsecond
Tiny Todo app in React and TypeScript demonstrating sub-second test feedback

## Patterns

### Test code

* Step definitions only interact with an `actor`
  * No information about UI or technology "leaks" through its API
  * There are multiple implementations of `IActor`
* `Then` steps are synchronous
  * It's previous steps' responsibility to ensure the system is in a "settled" state
  * The `ReactActor` implementation uses [@cucumber/microdata](https://github.com/cucumber/microdata) to query the DOM

### Production code

* The React app is completely decoupled from the network (HTTP)
  * React hooks for writing/reading data to/from the server - defined as custom types
  * Different implementations of these hooks - HTTP and direct in-memory access
  * The hook implementatins are injected into the React app during assembly
