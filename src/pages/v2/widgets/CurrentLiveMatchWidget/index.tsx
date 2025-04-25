import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import useObsRoom from '../../hooks/useObsRoom'

export default function CurrentLiveMatchWidget() {
  const { data: obsRoom } = useObsRoom()
  const { rtMatch } = useRealtimeMatch(
    obsRoom?.activeMatch?.id ?? obsRoom?.matchId
  )

  if (!rtMatch) {
    return <></>
  }

  return (
    <>
      <div className="border-2 border-error rounded text-center space-y-1 p-1">
        <div className="text-error text-xs font-bold">直播中</div>
        <div>{rtMatch.name}</div>
      </div>
    </>
  )
}
