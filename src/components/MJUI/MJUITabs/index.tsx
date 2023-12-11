import { useCallback, useState } from 'react'

type Props = {
  tabs: { label: React.ReactNode; value: string }[]
  onChangeValue?: (newValue: string) => unknown
  defaultValue?: string
}

const MJUITabs = ({ tabs, onChangeValue, defaultValue }: Props) => {
  const [value, setValue] = useState<string | undefined>(defaultValue)

  const handleClickTab = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const newValue = e.currentTarget.getAttribute('data-value') as string
      setValue(newValue)

      onChangeValue?.(newValue)
    },
    [onChangeValue]
  )

  return (
    <div className="border-b border-neutral-400">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className="py-2 px-4 border-b-2 border-transparent hover:bg-neutral-200 rounded-t data-[active='1']:border-teal-600 data-[active='1']:text-teal-800 data-[active='1']:bg-teal-100"
          data-value={tab.value}
          data-active={value === tab.value ? '1' : '0'}
          onClick={handleClickTab}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default MJUITabs
