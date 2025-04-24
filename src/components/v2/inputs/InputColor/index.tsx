import Sketch from '@uiw/react-color-sketch'
import { ColorResult } from '@uiw/color-convert'
import { useCallback } from 'react'

type InputColorProps = {
  value: string
  onChange?: (newColor: string) => void
  onBlur?: () => void
}

function InputColor({ value, onChange, onBlur }: InputColorProps) {
  const handleChange = useCallback(
    (newColorResult: ColorResult) => {
      onChange?.(newColorResult.hex)
    },
    [onChange]
  )

  return (
    <Sketch
      disableAlpha
      onChange={handleChange}
      onBlur={onBlur}
      color={value}
    />
  )
}

export default InputColor
