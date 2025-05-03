import { getRandomId } from '@/utils/string.util'
import { useCallback, useMemo } from 'react'

const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

export default function SelectNumber({
  value,
  onClick,
}: {
  value: number | null | undefined
  onClick?: (newNumber: number | null) => void
}) {
  const selfId = useMemo(() => `${getRandomId()}-number-select`, [])

  const handleClickClear = useCallback(() => {
    onClick?.(null)
    ;(document.getElementById(selfId) as HTMLElement)?.hidePopover()
  }, [onClick, selfId])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const value = parseInt(
        (e.currentTarget as HTMLDivElement).getAttribute('data-value') as string
      )
      onClick?.(value)
      ;(document.getElementById(selfId) as HTMLElement)?.hidePopover()
    },
    [onClick, selfId]
  )

  const handleClickMinus = useCallback(() => {
    onClick?.(Math.max(0, (value ?? 0) - 1))
  }, [onClick, value])

  const handleClickPlus = useCallback(() => {
    onClick?.(Math.min(99, (value ?? 0) + 1))
  }, [onClick, value])

  return (
    <>
      <div className="flex gap-x-1">
        <button
          className="cursor-pointer px-2 h-10 w-[1.5em] bg-neutral-200 border rounded-l-sm border-neutral-700 text-xl"
          onClick={handleClickMinus}
        >
          -
        </button>
        <button
          className="cursor-pointer px-2 h-10 w-[2.2em] bg-neutral-200 border border-neutral-700 text-xl"
          popoverTarget={selfId}
          style={
            {
              anchorName: `--${selfId}`,
            } as React.CSSProperties
          }
        >
          {value ?? '?'}
        </button>
        <button
          className="cursor-pointer px-2 h-10 w-[1.5em] bg-neutral-200 border rounded-r-sm border-neutral-700 text-xl"
          onClick={handleClickPlus}
        >
          +
        </button>
      </div>
      <div
        className="dropdown dropdown-center dropdown-top rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id={selfId}
        style={
          {
            positionAnchor: `--${selfId}`,
          } as React.CSSProperties
        }
      >
        <div className="card border border-base-300 shadow mb-1">
          <div className="card-content p-2">
            <div className="w-[4em] h-[4em] grid grid-cols-4 **:data-button:cursor-pointer **:data-button:text-[0.5em] **:data-button:h-[2em] **:data-button:w-[2em] **:data-button:leading-[2em] **:data-[active=true]:bg-primary **:data-[active=true]:text-primary-content">
              <button
                className="text-error"
                onClick={handleClickClear}
                data-button
              >
                <i className="bi bi-trash"></i>
              </button>
              {values.map((i) => (
                <button
                  key={i}
                  data-value={i}
                  onClick={handleClick}
                  data-button
                  data-active={value === i}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
