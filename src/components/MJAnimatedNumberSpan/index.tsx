import React, { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
}

function MJAnimatedNumberSpan({ value }: Props) {
  const [storedValue, setStoredValue] = useState<number>(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const animationMs = 1000
    const msPerFrame = 16

    for (let i = msPerFrame; i < animationMs; i += msPerFrame) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.innerText = Math.floor(
            storedValue - (storedValue - value) * (i / animationMs)
          ).toLocaleString('en-US')
        }
      }, i)
    }

    setTimeout(() => {
      setStoredValue(value)
    }, animationMs + msPerFrame)

    setTimeout(
      () => {
        setStoredValue(value)
      },
      animationMs + 2 * msPerFrame
    )

    setTimeout(
      () => {
        setStoredValue(value)
      },
      animationMs + 3 * msPerFrame
    )

    setTimeout(
      () => {
        setStoredValue(value)
      },
      animationMs + 4 * msPerFrame
    )

    setTimeout(
      () => {
        setStoredValue(value)
      },
      animationMs + 5 * msPerFrame
    )
  }, [storedValue, value])

  useEffect(() => {
    if (ref.current) {
      ref.current.innerText = storedValue.toLocaleString('en-US')
    }
  }, [storedValue])

  return <span ref={ref}> </span>
}

export default MJAnimatedNumberSpan
