import MatchIntroductionPage from '@/pages/match/[id]/introduction.page'
import ObsPage from '@/pages/match/[id]/obs.page'
import MatchSummaryPage from '@/pages/match/[id]/summary.page'
import RealtimeSummaryPage from '@/pages/realtime-summary/index.page'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'

type OBSInfo = {
  matchId: string
  activeSceneId: string
  activeSceneProps: Record<string, number>
}

type Scene = {
  id: string
  name: string
  render: (
    obsInfo: OBSInfo,
    compiledProps: Record<string, string | number>
  ) => React.ReactNode
  props?: SceneProp[]
}

type SceneProp = {
  key: string
  label: string
  type?: 'text' | 'number'
  defaultValue?: string | number
  description?: string
}

const SCENES: Scene[] = [
  {
    id: 'scoring',
    name: '直播分數',
    render: (obsInfo) => <ObsPage params={{ matchId: obsInfo.matchId }} />,
  },
  {
    id: 'introduction',
    name: '下一場對局介紹',
    render: (obsInfo) => (
      <MatchIntroductionPage params={{ matchId: obsInfo.matchId }} />
    ),
  },
  {
    id: 'result',
    name: '對局結果',
    render: (obsInfo) => (
      <MatchSummaryPage params={{ matchId: obsInfo.matchId }} />
    ),
  },
  {
    id: 'realtime-stat',
    name: '現時數據',
    render: (_, props) => <RealtimeSummaryPage {...props} />,
  },
  {
    id: 'realtime-stat-with-countdown',
    name: '現時數據(+下一場對局倒數＆自動播放)',
    render: (_, props) => <RealtimeSummaryPage {...props} />,
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

type Props = {
  params: { obsRoomId: string }
}

const ObsRoomSceneControlPage = ({ params: { obsRoomId } }: Props) => {
  const { data: obsInfo, update: updateObsInfo } = useFirebaseDatabaseByKey<
    string,
    OBSInfo,
    Partial<OBSInfo>
  >(`obs/${obsRoomId}`)

  const [selectedScene, setSelectedScene] = useState<Scene>(SCENES[0])
  const activeScene = useMemo(
    () => SCENES.find(({ id }) => id === obsInfo?.activeSceneId) ?? SCENES[0],
    [obsInfo?.activeSceneId]
  )

  const handleChangeSelectScene = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.currentTarget.value
      if (!newValue) {
        return
      }

      const foundScene = SCENES.find(({ id }) => id === newValue)
      if (!foundScene) {
        return
      }

      setSelectedScene(foundScene)
    },
    []
  )

  const handleSubmitSelectScene = useCallback(() => {
    updateObsInfo({
      activeSceneId: selectedScene.id,
    })
  }, [selectedScene.id, updateObsInfo])

  if (!obsInfo) {
    return <></>
  }

  return (
    <div className="container px-6 max-w-screen-md mx-auto space-y-6">
      <div>
        <p className="font-bold text-red-600">
          <i className="bi bi-record-circle"></i> 目前場景：
          {activeScene?.name ?? '(沒有)'}
        </p>
        <div className="relative aspect-video ring ring-red-500 mt-2">
          <div className="absolute overflow-hidden w-[1920px] h-[1080px] origin-top-left scale-[.167] sm:scale-[.375]">
            <ObsRoomScenePage params={{ obsRoomId }} />
          </div>
        </div>
      </div>

      <hr />

      <div>
        <p className="font-bold">切換場景</p>
        <select
          className="border border-gray-200 bg-gray-100 rounded-lg p-4 text-lg w-full"
          value={selectedScene.id}
          onChange={handleChangeSelectScene}
        >
          {SCENES.map((ppt) => (
            <option key={ppt.id} value={ppt.id}>
              {ppt.name}
            </option>
          ))}
        </select>
      </div>

      {selectedScene.props && (
        <div>
          <p className="font-bold mb-2">參數</p>
          <div className="space-y-6">
            {selectedScene.props?.map((prop) => (
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
        <button
          className="bg-green-300 border-green-400 rounded-lg text-green-800 text-lg py-4 px-16"
          onClick={handleSubmitSelectScene}
        >
          <i className="bi bi-play text-xl"></i> 切換場景
        </button>
      </div>
    </div>
  )
}

export default ObsRoomSceneControlPage

export const ObsRoomScenePage = ({ params: { obsRoomId } }: Props) => {
  const { data: obsInfo } = useFirebaseDatabaseByKey<
    string,
    OBSInfo,
    Partial<OBSInfo>
  >(`obs/${obsRoomId}`)

  const activeScene = useMemo(
    () => SCENES.find(({ id }) => id === obsInfo?.activeSceneId) ?? SCENES[0],
    [obsInfo?.activeSceneId]
  )

  if (!obsInfo) {
    return <></>
  }

  return (
    <div className="absolute inset-0">
      {activeScene.render(obsInfo, obsInfo.activeSceneProps)}
    </div>
  )
}
