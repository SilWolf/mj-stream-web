import { useMemo } from 'react'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import { SCENES } from '../SCENES'
import { useSearchParams } from 'wouter'

export default function V2ObsSceneViewPage() {
  const { data: obsRoom } = useObsRoom()
  const [searchParams] = useSearchParams()

  const activeScene = useMemo(
    () =>
      SCENES.find(({ id }) => id === searchParams.get('scene')) ??
      SCENES.find(({ id }) => id === obsRoom?.activeSceneId) ??
      SCENES[0],
    [obsRoom?.activeSceneId, searchParams]
  )

  if (!obsRoom) {
    return <></>
  }

  return <div className="fixed inset-0">{activeScene.render(obsRoom)}</div>
}
