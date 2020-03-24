# todo-react-typescript-subsecond
Tiny Todo app in React and TypeScript demonstrating sub-second test feedback

## Start the app

    npm start

## Run tests

    npm test

### Run tests in a particular assembly

    # Look for possible values in features/support/TodoWorld.ts
    ASSEMBLY=... ./cucumber

### Run Cucumber-Electron interactively

    ASSEMBLY=react ./cucumber -i

Keep each actor's DOM (omit cleaning up)

    ASSEMBLY=react KEEP_DOM=1 ./cucumber -i

### Run on CBT

Make sure you've built the client-side JavaScript:

    npm run build

Define your CBT credentials:

    export CBT_USERNAME=...
    export CBT_AUTHKEY=...

Run with a specific browser:

    ASSEMBLY=webdriver BROWSER=MicrosoftEdge CBT=1 CBT_VERSION=79 ./cucumber
    ASSEMBLY=webdriver BROWSER=chrome CBT=1 CBT_VERSION=55 ./cucumber

## Patterns

### Test code

* Step definitions only interact with an `actor`
  * No information about UI or technology "leaks" through its API
  * There are multiple implementations of `IActor`
* `Then` steps are synchronous
  * It's previous steps' responsibility to ensure the system is in a "settled" state
  * The `ReactActor` and `WebDriverActor` implementation uses [@cucumber/microdata](https://github.com/cucumber/microdata) to query the DOM
* Reuse "heavy" resources between scenarios
  * The same WebDriver browser instance (takes time to launch a new browser)
  * The same Server (takes time to run webpack). No webpack is used in react-http mode, but it's simpler to share the server anyway

### Production code

* The React app is completely decoupled from the network (HTTP)
  * React hooks for writing/reading data to/from the server - defined as custom types
  * Different implementations of these hooks - HTTP and direct in-memory access
  * The hook implementatins are injected into the React app during assembly
