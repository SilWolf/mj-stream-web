import { useMemo } from 'react'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import { SCENES } from '../SCENES'

export default function V2ObsSceneViewPage() {
  const { data: obsRoom } = useObsRoom()

  const activeScene = useMemo(
    () => SCENES.find(({ id }) => id === obsRoom?.activeSceneId) ?? SCENES[0],
    [obsRoom?.activeSceneId]
  )

  if (!obsRoom) {
    return <></>
  }

  return <div className="fixed inset-0">{activeScene.render(obsRoom)}</div>
}
