import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import { MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react'
import MJUIButton from '@/components/MJUI/MJUIButton'
import useWindowResize from '@/hooks/useWindowResize'
import { SceneAction, SCENES } from '@/pages/v2/obs/scenes/SCENES'
import { V2ObsRoom } from '@/pages/v2/models/V2ObsRoom.model'

export default function V2PanelObsSceneControlPage() {
  const previewWrapperRef = useRef<HTMLDivElement>(null)
  const [windowWidth] = useWindowResize()

  const { data: obsInfo, update: updateObsInfo } = useFirebaseDatabaseByKey<
    string,
    V2ObsRoom,
    Partial<V2ObsRoom>
  >(`obs/${import.meta.env.VITE_OBS_ROOM_ID}`)

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
    <>
      <div className="py-8 container px-6 max-w-(--breakpoint-md) mx-auto space-y-6">
        <div>
          <p className="font-bold text-red-600">
            <i className="bi bi-record-circle"></i> 目前場景：
            {activeScene?.name ?? '(沒有)'}
          </p>

          <div className="overflow-hidden w-full aspect-video ring-3 ring-error mt-2">
            <iframe
              className=" w-[1920px] h-[1080px] origin-top-left scale-[.375]"
              src="/v2/obs/scene/view"
              frameBorder={0}
            />
          </div>

          <div className="text-center">
            <a href="/v2/obs/scene/view" target="_blank">
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
    </>
  )
}
