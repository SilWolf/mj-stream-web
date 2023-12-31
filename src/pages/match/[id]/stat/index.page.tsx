import MJAmountSpan from '@/components/MJAmountSpan'
import MJHanFuTextSpan from '@/components/MJHanFuTextSpan'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import useMatch from '@/hooks/useMatch'
import { useMemo } from 'react'

type Props = {
  params: { matchId: string }
}

const MatchStatPage = ({ params: { matchId } }: Props) => {
  const { match, matchRounds } = useMatch(matchId)

  const matchRoundsWithDetail = useMemo(
    () =>
      Object.entries(matchRounds ?? {})
        .filter(([, matchRound]) => !!matchRound.resultDetail)
        .map(([matchRoundId, matchRound]) => ({
          id: matchRoundId,
          ...matchRound,
        })) ?? [],
    [matchRounds]
  )

  if (!match || !matchRounds) {
    return <></>
  }

  return (
    <div className="container mx-auto my-8 px-8 space-y-8">
      <h1 className="text-4xl text-center">{match.name}</h1>

      <div className="space-y-6">
        <h4 className="text-3xl">
          <i className="bi bi-bar-chart-steps"></i> 分數{' '}
          <span className="text-sm">
            ( 立=立直, 和=和牌, 統=出統, 摸=自摸, 聽=聽牌 )
          </span>
        </h4>

        <MJMatchHistoryTable
          players={match.players}
          matchRounds={matchRounds ?? {}}
          className="w-full table-auto"
        />
      </div>

      <div className="space-y-6">
        <h4 className="text-3xl">
          <i className="bi bi-clock-history"></i> 和牌記錄
        </h4>

        <table className="data-table w-full">
          <thead>
            <tr>
              <th>局數</th>
              <th>玩家</th>
              <th>分數</th>
              <th>役種</th>
            </tr>
          </thead>
          <tbody>
            {matchRoundsWithDetail.map((matchRound) => (
              <tr className="odd:bg-neutral-200" key={matchRound.id}>
                <td className="text-center py-1">
                  <MJMatchCounterSpan
                    roundCount={matchRound.roundCount}
                    extendedRoundCount={matchRound.extendedRoundCount}
                  />
                </td>
                <td
                  className="text-center py-1"
                  style={{
                    background:
                      match.players[matchRound.resultDetail!.winnerPlayerIndex]
                        .color,
                  }}
                >
                  {
                    match.players[matchRound.resultDetail!.winnerPlayerIndex]
                      .name
                  }
                </td>
                <td className="text-center py-1 text-xl">
                  <MJAmountSpan
                    value={
                      matchRound.playerResults[
                        matchRound.resultDetail!.winnerPlayerIndex
                      ].afterScore -
                      matchRound.playerResults[
                        matchRound.resultDetail!.winnerPlayerIndex
                      ].beforeScore
                    }
                    positiveClassName="text-green-600"
                    negativeClassName="text-red-600"
                    signed
                    hideZero
                  />
                </td>
                <td className="text-center py-1">
                  <p>
                    {matchRound
                      .resultDetail!.yakus.map(({ label }) => label)
                      .join(' ')}
                  </p>
                  <p>
                    <MJHanFuTextSpan
                      han={matchRound.resultDetail!.han}
                      fu={matchRound.resultDetail!.fu}
                      yakumanCount={matchRound.resultDetail!.yakumanCount}
                      isManganRoundUp={match.setting.isManganRoundUp === '1'}
                    />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MatchStatPage
