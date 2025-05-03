import { useEffect, useState } from 'react'

export default function useDebounce<T>(cb: T, delay: number = 500) {
  const [debounceValue, setDebounceValue] = useState<T>(cb)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(cb)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [cb, delay])
  return debounceValue
}
