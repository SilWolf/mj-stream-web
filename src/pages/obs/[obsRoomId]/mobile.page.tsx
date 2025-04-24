import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'react-use'

type Props = {
  params: { obsRoomId: string }
}

type ObsInfoProps = {
  matchId?: string
  startAt?: string
  scene?: 'countdown' | 'normal' | 'ended'
}

const ObsControlScenePage = ({ params: { obsRoomId } }: Props) => {
  const { data: obsInfo, update: updateObsInfo } =
    useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const [openSceneDialog, setOpenSceneDialog] = useState<boolean>(false)

  const handleClickCurrentSceneButton = useCallback(() => {
    setOpenSceneDialog(true)
  }, [])

  const handleCloseCurrentSceneButton = useCallback(() => {
    setOpenSceneDialog(false)
  }, [])

  const handleSetTime = useCallback(
    (value: number) => {
      if (!confirm(`確定設定倒數 ${value} 分鐘嗎？`)) {
        return
      }

      const date = new Date()
      date.setMinutes(date.getMinutes() + value)

      updateObsInfo({ startAt: date.toISOString() })
    },
    [updateObsInfo]
  )

  const handleClickChangeScene = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const scene = e.currentTarget.getAttribute(
        'data-scene'
      ) as ObsInfoProps['scene']
      if (!scene) {
        return
      }

      if (!confirm('確定要切換畫面了嗎？')) {
        return
      }

      updateObsInfo({
        scene,
      })
      setOpenSceneDialog(false)
    },
    [updateObsInfo]
  )

  if (!obsInfo) {
    return <></>
  }

  return (
    <div className="w-[100wh] h-[100vh] text-2xl text-center flex flex-col items-stretch">
      <div className="shrink-0">
        <button
          className="bg-gray-700 text-white w-full p-4"
          onClick={handleClickCurrentSceneButton}
        >
          <div className="flex">
            <div className="shrink-0 text-red-400 text-2xl">
              <i className="bi bi-camera-reels"></i>
            </div>
            <div className="flex-1">
              {obsInfo.scene === 'countdown' && <p>現正播放：待機畫面</p>}
              {obsInfo.scene === 'normal' && <p>現正播放：正常畫面</p>}
              {obsInfo.scene === 'ended' && <p>現正播放：結束畫面</p>}
            </div>
          </div>
        </button>
      </div>
      <div className="flex-1">
        <ObsControlSceneForCountdown
          obsInfo={obsInfo}
          onSetTime={handleSetTime}
        />
      </div>

      <MJUIDialogV2
        open={openSceneDialog}
        onClose={handleCloseCurrentSceneButton}
      >
        <p className="text-left">請先在 OBS 上切換畫面，再切換這裡的畫面</p>

        <div className="space-y-2 mt-8">
          <button
            className="block w-full py-4 text-center border-2 border-green-500"
            data-scene="countdown"
            onClick={handleClickChangeScene}
          >
            倒數畫面
          </button>
          <button
            className="block w-full py-4 text-center border-2 border-green-500"
            data-scene="normal"
            onClick={handleClickChangeScene}
          >
            正常畫面
          </button>
          <button
            className="block w-full py-4 text-center border-2 border-green-500"
            data-scene="ended"
            onClick={handleClickChangeScene}
          >
            結束畫面
          </button>
        </div>
      </MJUIDialogV2>
    </div>
  )
}

export default ObsControlScenePage

const ObsCountdownTimer = ({
  startAt,
}: {
  startAt: string | null | undefined
}) => {
  const [sec, setSec] = useState<number>(0)
  const [minutes, seconds] = useMemo(
    () => [
      Math.floor(sec / 60)
        .toString()
        .padStart(2, '0'),
      (sec % 60).toString().padStart(2, '0'),
    ],
    [sec]
  )

  useEffect(() => {
    if (!startAt) {
      return
    }

    const targetDate = new Date(startAt)
    if (targetDate) {
      const currentDate = new Date()
      setSec(
        Math.max(
          0,
          Math.ceil((targetDate.getTime() - currentDate.getTime()) / 1000)
        )
      )
    }
  }, [startAt])

  useInterval(
    () => {
      setSec((prev) => prev - 1)
    },
    sec > 0 ? 1000 : null
  )

  return (
    <div
      style={{
        background: sec <= 0 ? '#f00' : 'transparent',
      }}
    >
      {minutes}:{seconds}
    </div>
  )
}

const ObsControlSceneForCountdown = ({
  obsInfo,
  onSetTime,
}: {
  obsInfo: ObsInfoProps | undefined
  onSetTime: (value: number) => void
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = parseInt(
        e.currentTarget.getAttribute('data-value') as string
      )
      if (isNaN(value)) {
        return
      }

      onSetTime(value)
    },
    [onSetTime]
  )

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-y-6">
      <p className="text-[4em] leading-[1em]">
        <ObsCountdownTimer startAt={obsInfo?.startAt} />
      </p>
    </div>
  )
}
