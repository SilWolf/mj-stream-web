import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  options: { label: string; value: string }[]
  value?: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const MJUISelectClicker = ({ options, value, onChange, disabled }: Props) => {
  const [index, setIndex] = useState<number>(0)
  const myOption = useMemo(() => options[index], [index, options])

  const handleClickMinus = useCallback(() => {
    const newIndex = Math.max(0, index - 1)
    setIndex(newIndex)
    onChange?.(options[newIndex].value)
  }, [index, onChange, options])

  const handleClickPlus = useCallback(() => {
    const newIndex = Math.min(options.length - 1, index + 1)
    setIndex(newIndex)
    onChange?.(options[newIndex].value)
  }, [index, onChange, options])

  useEffect(() => {
    if (typeof value !== 'undefined' && value !== myOption.value) {
      const foundIndex = options.findIndex((option) => option.value === value)
      if (foundIndex !== -1) {
        setIndex(foundIndex)
      }
    }
  }, [myOption.value, options, value])

  return (
    <div className="flex items-center">
      <div className="shrink-0">
        <button
          className="w-4 h-4 text-center text-xs"
          onClick={handleClickMinus}
          disabled={disabled}
        >
          <i className="bi bi-dash-circle"></i>
        </button>
      </div>
      <div className="flex-1 text-center text-2xl">{myOption.label}</div>
      <div className="shrink-0">
        <button
          className="w-4 h-4 text-center text-xs"
          onClick={handleClickPlus}
          disabled={disabled}
        >
          <i className="bi bi-plus-circle"></i>
        </button>
      </div>
    </div>
  )
}

export default MJUISelectClicker
