import MatchIntroductionPage from '@/pages/match/[id]/introduction.page'
import ObsPage from '@/pages/match/[id]/obs.page'
import MatchSummaryPage from '@/pages/match/[id]/summary.page'
import RealtimeSummaryPage from '@/pages/realtime-summary/index.page'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import { MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react'
import ObsRoomEndPage from '../ended.page'
import MJUIButton from '@/components/MJUI/MJUIButton'
import useWindowResize from '@/hooks/useWindowResize'

type OBSInfo = {
  matchId: string
  activeSceneId: string
  activeSceneProps: Record<string, string | number>
}

type Scene = {
  id: string
  name: string
  render: (obsInfo: OBSInfo) => React.ReactNode
  actions?: SceneAction[]
}

type SceneAction = {
  key: string
  label: React.ReactNode
  perform: (
    oldProp: Record<string, string | number>
  ) => Record<string, string | number>
}

const SCENES: Scene[] = [
  {
    id: 'scoring',
    name: '直播分數',
    render: (obsInfo) => <ObsPage params={{ matchId: obsInfo.matchId }} />,
  },
  {
    id: 'introduction',
    name: '賽前介紹',
    render: (obsInfo) => (
      <MatchIntroductionPage
        params={{ matchId: obsInfo.matchId }}
        disableClick
        forwardFlag={obsInfo.activeSceneProps?.forwardFlag as number}
        resetFlag={obsInfo.activeSceneProps?.resetFlag as number}
      />
    ),
    actions: [
      {
        key: 'reset',
        label: (
          <span>
            <i className="bi bi-skip-backward-fill"></i> 回到第一頁
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            resetFlag: 1 - ((oldProp.resetFlag as number) ?? 0),
          }
        },
      },
      {
        key: 'forward',
        label: (
          <span>
            <i className="bi bi-forward"></i> 下一頁
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            forwardFlag: 1 - ((oldProp.forwardFlag as number) ?? 0),
          }
        },
      },
    ],
  },
  {
    id: 'result',
    name: '對局結果',
    render: (obsInfo) => (
      <MatchSummaryPage
        params={{ matchId: obsInfo.matchId }}
        disableClick
        forwardFlag={obsInfo.activeSceneProps?.forwardFlag as number}
        resetFlag={obsInfo.activeSceneProps?.resetFlag as number}
      />
    ),
    actions: [
      {
        key: 'reset',
        label: (
          <span>
            <i className="bi bi-skip-backward-fill"></i> 回到第一頁
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            resetFlag: 1 - ((oldProp.resetFlag as number) ?? 0),
          }
        },
      },
      {
        key: 'forward',
        label: (
          <span>
            <i className="bi bi-forward"></i> 下一頁
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            forwardFlag: 1 - ((oldProp.forwardFlag as number) ?? 0),
          }
        },
      },
    ],
  },
  {
    id: 'realtime-stat',
    name: '現時數據',
    render: (obsInfo) => (
      <RealtimeSummaryPage
        disableClick
        forwardFlag={obsInfo.activeSceneProps?.forwardFlag as number}
        resetFlag={obsInfo.activeSceneProps?.resetFlag as number}
        refetchFlag={obsInfo.activeSceneProps?.refetchFlag as number}
      />
    ),
    actions: [
      {
        key: 'refetch',
        label: (
          <span>
            <i className="bi bi-cloud-download"></i> 下載最新數據
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            refetchFlag: 1 - ((oldProp.refetchFlag as number) ?? 0),
          }
        },
      },
      {
        key: 'reset',
        label: (
          <span>
            <i className="bi bi-skip-backward-fill"></i> 回到第一頁
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            resetFlag: 1 - ((oldProp.resetFlag as number) ?? 0),
          }
        },
      },
      {
        key: 'forward',
        label: (
          <span>
            <i className="bi bi-forward"></i> 下一頁
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            forwardFlag: 1 - ((oldProp.forwardFlag as number) ?? 0),
          }
        },
      },
    ],
  },
  {
    id: 'realtime-stat-with-countdown',
    name: '現時數據(+下一場對局倒數＆自動播放)',
    render: (obsInfo) => (
      <RealtimeSummaryPage
        disableClick
        auto
        minute={(obsInfo.activeSceneProps?.minute as number) ?? 0}
        refetchFlag={obsInfo.activeSceneProps?.refetchFlag as number}
      />
    ),
    actions: [
      {
        key: 'p5m',
        label: (
          <span>
            <i className="bi bi-caret-up-fill"></i> +5 分鐘
          </span>
        ),
        perform: (oldProp) => {
          return {
            minute: ((oldProp.minute as number) ?? 0) + 5,
          }
        },
      },
      {
        key: 'p1m',
        label: (
          <span>
            <i className="bi bi-caret-up"></i> +1 分鐘
          </span>
        ),
        perform: (oldProp) => {
          return {
            minute: ((oldProp.minute as number) ?? 0) + 1,
          }
        },
      },
      {
        key: 'm1m',
        label: (
          <span>
            <i className="bi bi-caret-down"></i> -1 分鐘
          </span>
        ),
        perform: (oldProp) => {
          return {
            minute: Math.max(((oldProp.minute as number) ?? 0) - 1, 0),
          }
        },
      },
      {
        key: 'm5m',
        label: (
          <span>
            <i className="bi bi-caret-down-fill"></i> -5 分鐘
          </span>
        ),
        perform: (oldProp) => {
          return {
            minute: Math.max(((oldProp.minute as number) ?? 0) - 5, 0),
          }
        },
      },
      {
        key: 'reset-10m',
        label: (
          <span>
            <i className="bi bi-arrow-clockwise"></i> 重設成 10 分鐘
          </span>
        ),
        perform: () => {
          return {
            minute: 10,
          }
        },
      },
      {
        key: 'refetch',
        label: (
          <span>
            <i className="bi bi-cloud-download"></i> 下載最新數據
          </span>
        ),
        perform: (oldProp) => {
          return {
            ...oldProp,
            refetchFlag: 1 - ((oldProp.refetchFlag as number) ?? 0),
          }
        },
      },
    ],
  },
  {
    id: 'ended',
    name: '本日已結束',
    render: () => <ObsRoomEndPage />,
  },
]

type Props = {
  params: { obsRoomId: string }
}

const ObsRoomSceneControlPage = ({ params: { obsRoomId } }: Props) => {
  const previewWrapperRef = useRef<HTMLDivElement>(null)
  const [windowWidth] = useWindowResize()

  const { data: obsInfo, update: updateObsInfo } = useFirebaseDatabaseByKey<
    string,
    OBSInfo,
    Partial<OBSInfo>
  >(`obs/${obsRoomId}`)

  const activeScene = useMemo(
    () => SCENES.find(({ id }) => id === obsInfo?.activeSceneId) ?? SCENES[0],
    [obsInfo?.activeSceneId]
  )

  const handleClickChangeScene = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const newValue = e.currentTarget.getAttribute('data-id')
      if (!newValue) {
        return
      }

      const foundScene = SCENES.find(({ id }) => id === newValue)
      if (!foundScene) {
        return
      }

      updateObsInfo({
        activeSceneId: foundScene.id,
      })
    },
    [updateObsInfo]
  )

  const handleClickAction = useCallback(
    (fn: SceneAction['perform']) => () => {
      updateObsInfo({
        activeSceneProps: fn(obsInfo?.activeSceneProps ?? {}),
      })
    },
    [obsInfo?.activeSceneProps, updateObsInfo]
  )

  useEffect(() => {
    if (!previewWrapperRef.current) {
      return
    }

    const scale = Math.min(
      0.375,
      Math.max(0, ((windowWidth - 48) / 720) * 0.375)
    )

    previewWrapperRef.current.style.transform = `scale(${scale})`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewWrapperRef.current, windowWidth])

  if (!obsInfo) {
    return <></>
  }

  return (
    <main>
      <a
        href="/obs/1/control"
        className="block text-center py-4 bg-neutral-300"
      >
        切換到入分控制台 <i className="bi bi-arrow-right-circle-fill"></i>
      </a>
      <div className="py-8 container px-6 max-w-(--breakpoint-md) mx-auto space-y-6">
        <div>
          <p className="font-bold text-red-600">
            <i className="bi bi-record-circle"></i> 目前場景：
            {activeScene?.name ?? '(沒有)'}
          </p>
          <div className="relative aspect-video ring-3 ring-red-500 mt-2">
            <div
              className="absolute overflow-hidden w-[1920px] h-[1080px] origin-top-left scale-[.375]"
              ref={previewWrapperRef}
            >
              <ObsRoomScenePage params={{ obsRoomId }} />
            </div>
          </div>
          <div className="text-center">
            <a href="/obs/1/scene" target="_blank">
              打開連結 <i className="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
          {activeScene.actions && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <p className="font-bold">
                <i className="bi bi-hand-index-thumb"></i> 場景動作：
              </p>
              {activeScene.actions.map((action) => (
                <MJUIButton
                  size="xlarge"
                  key={action.key}
                  onClick={handleClickAction(action.perform)}
                >
                  {action.label}
                </MJUIButton>
              ))}
            </div>
          )}
        </div>

        <hr />

        <div>
          <p className="font-bold mb-2">切換場景（雙點擊以防誤觸）</p>
          <div className="flex flex-wrap gap-2">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                data-id={scene.id}
                data-active={scene.id === activeScene.id}
                className="bg-green-300 border-green-400 rounded-lg text-green-800 text-lg py-4 px-6 data-[active=true]:ring-3 data-[active=true]:ring-red-500"
                onDoubleClick={handleClickChangeScene}
              >
                {scene.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
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

  return <div className="absolute inset-0">{activeScene.render(obsInfo)}</div>
}
