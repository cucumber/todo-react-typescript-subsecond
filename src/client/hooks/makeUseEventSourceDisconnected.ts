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
      return () => {
        eventSource.onerror = () => undefined
        eventSource.onopen = () => undefined
      }
    }, [])
    return disconnected
  }
}
