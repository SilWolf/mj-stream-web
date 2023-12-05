import Sketch from '@uiw/react-color-sketch'
import { ColorResult } from '@uiw/color-convert'
import { useCallback } from 'react'

type MJUIInputForColorProps = {
  value: string
  onChange?: (newColor: string) => void
  onBlur?: () => void
}

function MJUIInputForColor({
  value,
  onChange,
  onBlur,
}: MJUIInputForColorProps) {
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

export default MJUIInputForColor
