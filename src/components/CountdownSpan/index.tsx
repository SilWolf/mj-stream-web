import { useEffect, useMemo, useState } from 'react'
import { useInterval } from 'react-use'

type Props = {
  m: number
}

const CountdownSpan = ({ m }: Props) => {
  const [sec, setSec] = useState<number>(m * 60)
  const [minutes, seconds] = useMemo(
    () => [
      Math.floor(sec / 60)
        .toString()
        .padStart(2, '0'),
      (sec % 60).toString().padStart(2, '0'),
    ],
    [sec]
  )

  useEffect(() => {
    setSec(m * 60)
  }, [m])

  useInterval(
    () => {
      setSec((prev) => prev - 1)
    },
    sec > 0 ? 1000 : null
  )

  if (sec <= 0) {
    return <span>--:--</span>
  }

  return (
    <span>
      {minutes}:{seconds}
    </span>
  )
}

export default CountdownSpan
