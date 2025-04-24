import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '@/providers/firebaseDatabase.provider'
import { V2ObsRoom } from '../models/V2ObsRoom.model'

export default function useObsRoom() {
  const fb = useFirebaseDatabase()
  const obsRoomId = import.meta.env.VITE_OBS_ROOM_ID
  const { data } = useFirebaseDatabaseByKey<string, V2ObsRoom>(
    `obs/${obsRoomId}`
  )

  return {
    data,
    actions: {
      setHidingHeader: (newValue: boolean) =>
        fb.set(`obs/${obsRoomId}/props/isHidingHeader`, newValue),
      setHidingPlayers: (newValue: boolean) =>
        fb.set(`obs/${obsRoomId}/props/isHidingPlayers`, newValue),
      setScoreDisplayMode: (newValue: 'score' | 'point') =>
        fb.set(`obs/${obsRoomId}/props/scoreDisplayMode`, newValue),
      setActiveReviewMatchRoundId: (newValue: string | null) =>
        fb.set(`obs/${obsRoomId}/props/activeReviewMatchRoundId`, newValue),
    },
  }
}
