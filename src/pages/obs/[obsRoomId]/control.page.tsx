import React, { useMemo } from 'react'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import ControlPage from '@/pages/match/[id]/control/index.page'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsRoomControlPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)
  const obsPageParams = useMemo(
    () => ({ matchId: obsInfo?.matchId as string }),
    [obsInfo?.matchId]
  )

  if (!obsPageParams || !obsPageParams.matchId) {
    return <>讀取中…</>
  }

  return (
    <main>
      <a
        href="/obs/1/scene-control"
        className="block text-center py-4 bg-neutral-300"
      >
        <i className="bi bi-arrow-left-circle-fill"></i> 切換到場景控制台
      </a>
      <ControlPage params={obsPageParams} />
    </main>
  )
}
