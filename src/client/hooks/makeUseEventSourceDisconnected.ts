import { useEffect, useState } from 'react'
import { UseDisconnected } from '../components/types'

/**
 * Makes a {@link UseTodoList} React hook that uses an EventSource connection
 * to signal when the the client is connected.
 *
 * @return a {@link UseTodoList} React hook
 */
export default function makeUseEventSourceDisconnected(eventSource: EventSource): UseDisconnected {
  return () => {
    const [disconnected, setDisconnected] = useState<boolean>(true)

    useEffect(() => {
      eventSource.onerror = () => setDisconnected(true)
      eventSource.onopen = () => setDisconnected(false)
      // Poll connection status. Needed because the EventSource may have connected *before* the effect has a chance
      // to register the handlers
      const statusPoller = setInterval(() => {
        switch (eventSource.readyState) {
          case EventSource.CLOSED:
          case EventSource.CONNECTING:
            setDisconnected(true)
            break
          case EventSource.OPEN:
            setDisconnected(false)
        }
      }, 100)
      return () => {
        eventSource.onerror = () => undefined
        eventSource.onopen = () => undefined
        clearInterval(statusPoller)
      }
    }, [])
    return disconnected
  }
}
