import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  signed?: boolean
  className?: string
  positiveClassName?: string
  negativeClassName?: string
  value: number
  animated?: boolean
  hideZero?: boolean
}

function MJAmountSpan({
  signed,
  className,
  positiveClassName,
  negativeClassName,
  value,
  animated,
  hideZero,
}: Props) {
  const [storedValue, setStoredValue] = useState<number>(value)
  const ref = useRef<HTMLSpanElement>(null)

  const formatNumber = useCallback(
    (newValue: number) => {
      if (newValue === 0) {
        if (hideZero) {
          return ''
        }

        return newValue.toString()
      }

      if (newValue > 0) {
        return `${signed ? '+' : ''}${Math.floor(newValue)}`
      }

      return Math.floor(newValue).toString()
    },
    [signed]
  )

  const storedValueDisplay = useMemo(
    () => formatNumber(storedValue),
    [formatNumber, storedValue]
  )

  const myClassName = useMemo(() => {
    if (value > 0) {
      return `${className} ${positiveClassName}`
    }
    if (value < 0) {
      return `${className} ${negativeClassName}`
    }

    return className
  }, [className, negativeClassName, positiveClassName, value])

  useEffect(() => {
    if (storedValue !== value) {
      if (animated) {
        const animationMs = 1000
        const msPerFrame = 16

        for (let i = msPerFrame; i < animationMs; i += msPerFrame) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.innerText = Math.floor(
                storedValue - (storedValue - value) * (i / animationMs)
              ).toString()
            }
          }, i)
        }

        setTimeout(() => {
          setStoredValue(value)
        }, animationMs + msPerFrame)
      } else {
        setStoredValue(value)
      }
    }
  }, [animated, storedValue, value])

  useEffect(() => {
    if (ref.current) {
      ref.current.innerText = storedValueDisplay
    }
  }, [storedValueDisplay])

  return <span ref={ref} className={myClassName} />
}

export default MJAmountSpan
