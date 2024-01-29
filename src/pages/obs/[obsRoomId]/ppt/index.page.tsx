import RealtimeSummaryPage from '@/pages/realtime-summary/index.page'
import { ChangeEvent, useCallback, useState } from 'react'

type PPT = {
  id: string
  name: string
  component: (compiledProps: Record<string, string | number>) => React.ReactNode
  props?: PPTProp[]
}

type PPTProp = {
  key: string
  label: string
  type?: 'text' | 'number'
  defaultValue?: string | number
  description?: string
}

const PPTS: PPT[] = [
  {
    id: 'realtime-stat',
    name: '即時數據',
    component: (props) => <RealtimeSummaryPage {...props} />,
  },
  {
    id: 'realtime-stat-with-countdown',
    name: '即時數據(+下一場對局倒數＆自動播放)',
    component: (props) => <RealtimeSummaryPage {...props} />,
    props: [
      {
        key: 'm',
        label: '倒數分鐘',
        type: 'number',
        defaultValue: 15,
        description: '倒數多少分鐘，會顯示在畫面左下角。',
      },
    ],
  },
]

const ObsRoomPPTPage = () => {
  const [selectedPPT, setSelectedPPT] = useState<PPT>(PPTS[0])

  const handleChangeSelectPPT = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.currentTarget.value
      if (!newValue) {
        return
      }

      const foundPPT = PPTS.find(({ id }) => id === newValue)
      if (!foundPPT) {
        return
      }

      setSelectedPPT(foundPPT)
    },
    []
  )

  return (
    <div className="container max-w-screen-md mx-auto space-y-6">
      <div>
        <p className="font-bold text-red-600">
          <i className="bi bi-record-circle"></i> 目前PPT：
        </p>
      </div>

      <div>
        <p className="font-bold">切換PPT</p>
        <select
          className="border border-gray-200 bg-gray-100 rounded-lg p-4 text-lg w-full"
          value={selectedPPT.id}
          onChange={handleChangeSelectPPT}
        >
          {PPTS.map((ppt) => (
            <option value={ppt.id}>{ppt.name}</option>
          ))}
        </select>
      </div>

      {selectedPPT.props && (
        <div>
          <p className="font-bold mb-2">參數</p>
          <div className="space-y-6">
            {selectedPPT.props?.map((prop) => (
              <div key={prop.key}>
                <p>
                  <label htmlFor={`prop-${prop.key}`}>{prop.label}</label>
                </p>
                <input
                  name={`prop-${prop.key}`}
                  type={prop.type ?? 'text'}
                  defaultValue={prop.defaultValue}
                />
                <p className="text-sm text-neutral-800">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <button className="bg-green-300 border-green-400 rounded-lg text-green-800 text-lg py-4 px-16">
          <i className="bi bi-play text-xl"></i> 開始播放
        </button>
      </div>
    </div>
  )
}

export default ObsRoomPPTPage
