import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import { useCallback, useMemo } from 'react'

export default function RevealEditKeyboard({
  value,
  onClickReplace,
  onClickDelete,
}: {
  value: string
  onClickReplace?: (oldCombination: string, newCombination: string) => void
  onClickDelete?: (combination: string) => void
}) {
  const kanngCombination = useMemo(() => {
    const matches = [...value.matchAll(/(\d)([mpsz])/g)]
    if (matches.length !== 3) {
      return null
    }

    if (!(matches[0][2] === matches[1][2] && matches[0][2] === matches[2][2])) {
      return null
    }

    if (matches[0][1] === matches[1][1] && matches[0][1] === matches[2][1]) {
      if (matches[0][1] === '5') {
        return value.replace('-', `-0${matches[0][2]}=`)
      } else {
        console.log(value.replace('-', `-${matches[0][0]}=`))
        return value.replace('-', `-${matches[0][0]}=`)
      }
    }

    if (
      (matches[0][1] === '0' || matches[0][1] === '5') &&
      (matches[1][1] === '0' || matches[1][1] === '5') &&
      (matches[2][1] === '0' || matches[2][1] === '5')
    ) {
      return value.replace('-', `-5${matches[0][2]}=`)
    }

    return null
  }, [value])

  const handleClickCombination = useCallback(() => {
    if (!kanngCombination) {
      return
    }
    onClickReplace?.(value, kanngCombination)
  }, [kanngCombination, onClickReplace, value])

  const handleClickDelete = useCallback(() => {
    onClickDelete?.(value)
  }, [onClickDelete, value])

  return (
    <div className="**:data-button:flex **:data-button:justify-center **:data-button:p-1 **:data-button:cursor-pointer **:data-button:hover:bg-base-200">
      <div className="w-[12em] flex items-start">
        {kanngCombination && (
          <button
            className="flex-1 pt-[.8em]!"
            onClick={handleClickCombination}
            data-button
          >
            <MJTileCombinationDiv value={kanngCombination} />
          </button>
        )}
        <button className="flex-1" onClick={handleClickDelete} data-button>
          <i className="bi bi-trash-fill text-error"></i>
        </button>
      </div>
    </div>
  )
}
