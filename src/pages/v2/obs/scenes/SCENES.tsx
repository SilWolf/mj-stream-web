import { V2ObsRoom } from '@/pages/v2/models/V2ObsRoom.model'
import { lazy } from 'react'

const V2ObsSceneOfLatestStatistics = lazy(
  () => import('./latest-statistics/page')
)
const V2ObsSceneOfRealtime = lazy(() => import('./realtime/page'))
const V2ObsSceneOfIntroductionForMatch = lazy(
  () => import('./introduction-of-match/page')
)
const V2ObsSceneOfResultForRealtimeMatch = lazy(
  () => import('./result-of-realtime-match/page')
)

const V2ObsSceneOfEndOfDay = lazy(() => import('./end-of-day/page'))

export type Scene = {
  id: string
  name: string
  render: (obsInfo: V2ObsRoom) => React.ReactNode
  actions?: SceneAction[]
}

export type SceneAction = {
  key: string
  label: React.ReactNode
  perform: (
    oldProp: Record<string, string | number>
  ) => Record<string, string | number>
}

export const SCENES: Scene[] = [
  {
    id: 'realtime',
    name: '直播分數',
    render: (obsInfo) => (
      <V2ObsSceneOfRealtime
        themeId={obsInfo.themeId}
        params={{ matchId: obsInfo.matchId }}
      />
    ),
  },
  {
    id: 'latest-statistics',
    name: '現時數據',
    render: (obsInfo) => (
      <V2ObsSceneOfLatestStatistics
        themeId={obsInfo.themeId}
        params={{ tournamentId: obsInfo.tournamentId as string }}
        forwardFlag={obsInfo.activeSceneProps?.forwardFlag as number}
        resetFlag={obsInfo.activeSceneProps?.resetFlag as number}
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
    id: 'introduction',
    name: '賽前介紹',
    render: (obsInfo) => (
      <V2ObsSceneOfIntroductionForMatch
        themeId={obsInfo.themeId}
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
      <V2ObsSceneOfResultForRealtimeMatch
        themeId={obsInfo.themeId}
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
    id: 'realtime-stat-with-countdown',
    name: '現時數據(+下一場對局倒數＆自動播放)',
    render: (obsInfo) => (
      <V2ObsSceneOfLatestStatistics
        themeId={obsInfo.themeId}
        params={{ tournamentId: obsInfo.tournamentId as string }}
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
    render: (obsInfo) => <V2ObsSceneOfEndOfDay themeId={obsInfo.themeId} />,
  },
]
