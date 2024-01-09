import React, { useCallback, useState } from 'react'
import useMatch from '@/hooks/useMatch'
import {
  MatchRound,
  PlayerIndex,
  PlayerPositionEnum,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import { getPlayerPosition } from '@/helpers/mahjong.helper'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import MJUIButton from '@/components/MJUI/MJUIButton'
import { getRandomId } from '@/utils/string.util'

type Props = {
  params: { matchId: string }
}

const mapRoundType: Record<MatchRound['resultType'], string> = {
  [RoundResultTypeEnum.Ron]: 'ron',
  [RoundResultTypeEnum.SelfDrawn]: 'tsumo',
  [RoundResultTypeEnum.Exhausted]: 'exhausted',
  [RoundResultTypeEnum.Hotfix]: 'hotfix',
  [RoundResultTypeEnum.Unknown]: 'unknown',
}

const mapPlayerPosition = {
  [PlayerPositionEnum.East]: 'east',
  [PlayerPositionEnum.South]: 'south',
  [PlayerPositionEnum.West]: 'west',
  [PlayerPositionEnum.North]: 'north',
}

const mapPlayerWinOrLose = {
  [PlayerResultWinnerOrLoserEnum.None]: 'none',
  [PlayerResultWinnerOrLoserEnum.Win]: 'win',
  [PlayerResultWinnerOrLoserEnum.Lose]: 'lose',
}

const mapPlayerResult = (matchRound: MatchRound, playerIndex: PlayerIndex) => ({
  position:
    mapPlayerPosition[getPlayerPosition(playerIndex, matchRound.roundCount)],
  type: mapPlayerWinOrLose[matchRound.playerResults[playerIndex].type],
  status:
    matchRound.playerResults[playerIndex].isRiichi ||
    matchRound.playerResults[playerIndex].detail?.isRiichied
      ? 'isRiichied'
      : matchRound.playerResults[playerIndex].isRevealed ||
        matchRound.playerResults[playerIndex].detail?.isRevealed
      ? 'isRevealed'
      : 'none',
  isWaited:
    !!matchRound.playerResults[playerIndex].waitingTiles &&
    (matchRound.playerResults[playerIndex].waitingTiles as string[]).length > 0,
  beforeScore: matchRound.playerResults[playerIndex].beforeScore,
  afterScore: matchRound.playerResults[playerIndex].afterScore,
  dora: matchRound.playerResults[playerIndex].detail?.dora,
  redDora: matchRound.playerResults[playerIndex].detail?.redDora,
  innerDora: matchRound.playerResults[playerIndex].detail?.innerDora,
  han: matchRound.playerResults[playerIndex].detail?.han,
  fu: matchRound.playerResults[playerIndex].detail?.fu,
  yaku: matchRound.playerResults[playerIndex].detail?.yakus
    ?.map(({ label }) => label)
    .join(' '),
  pureScore: 0,
})

export default function MatchExportPage({ params: { matchId } }: Props) {
  const { match, matchRounds, matchCurrentRound } = useMatch(matchId)

  const [isExported, setIsExported] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const handleClickExport = useCallback(() => {
    if (!match || !matchRounds) {
      return
    }

    const myMatchRounds = Object.values(matchRounds)

    const lastRound = myMatchRounds[myMatchRounds.length - 1]

    const ranking = [
      { index: '0', score: lastRound.playerResults[0].afterScore },
      { index: '1', score: lastRound.playerResults[1].afterScore },
      { index: '2', score: lastRound.playerResults[2].afterScore },
      { index: '3', score: lastRound.playerResults[3].afterScore },
    ].sort((a, b) => {
      if (a.score === b.score) {
        return a.index < b.index ? -1 : 1
      }

      return b.score - a.score
    })
    const rankingByPlayerIndex = {
      '0': (ranking.findIndex((rank) => rank.index === '0') + 1).toString(),
      '1': (ranking.findIndex((rank) => rank.index === '1') + 1).toString(),
      '2': (ranking.findIndex((rank) => rank.index === '2') + 1).toString(),
      '3': (ranking.findIndex((rank) => rank.index === '3') + 1).toString(),
    }
    const pointOffsetByRanking: Record<string, number> = {
      '1': 50,
      '2': 10,
      '3': -10,
      '4': -30,
    }

    const exportedMatch = {
      _id: matchId,
      result: {
        playerEast: {
          score: lastRound.playerResults[0].afterScore,
          ranking: rankingByPlayerIndex['0'],
          point:
            (lastRound.playerResults[0].afterScore - 30000) / 1000.0 +
            pointOffsetByRanking[rankingByPlayerIndex['0']],
          penalty: lastRound.playerResults[0].isRedCarded ? -30 : 0,
          penaltyReason: lastRound.playerResults[0].isRedCarded ? '紅牌' : '',
        },
        playerSouth: {
          score: lastRound.playerResults[1].afterScore,
          ranking: rankingByPlayerIndex['1'],
          point:
            (lastRound.playerResults[1].afterScore - 30000) / 1000.0 +
            pointOffsetByRanking[rankingByPlayerIndex['1']],
          penalty: lastRound.playerResults[1].isRedCarded ? -30 : 0,
          penaltyReason: lastRound.playerResults[1].isRedCarded ? '紅牌' : '',
        },
        playerWest: {
          score: lastRound.playerResults[2].afterScore,
          ranking: rankingByPlayerIndex['2'],
          point:
            (lastRound.playerResults[2].afterScore - 30000) / 1000.0 +
            pointOffsetByRanking[rankingByPlayerIndex['2']],
          penalty: lastRound.playerResults[2].isRedCarded ? -30 : 0,
          penaltyReason: lastRound.playerResults[2].isRedCarded ? '紅牌' : '',
        },
        playerNorth: {
          score: lastRound.playerResults[3].afterScore,
          ranking: rankingByPlayerIndex['3'],
          point:
            (lastRound.playerResults[3].afterScore - 30000) / 1000.0 +
            pointOffsetByRanking[rankingByPlayerIndex['3']],
          penalty: lastRound.playerResults[3].isRedCarded ? -30 : 0,
          penaltyReason: lastRound.playerResults[3].isRedCarded ? '紅牌' : '',
        },
      },
      rounds: myMatchRounds.map((round) => ({
        _key: getRandomId(),
        type: mapRoundType[round.resultType],
        code: `${round.roundCount}.${round.extendedRoundCount}`,
        playerEast: mapPlayerResult(round, '0'),
        playerSouth: mapPlayerResult(round, '1'),
        playerWest: mapPlayerResult(round, '2'),
        playerNorth: mapPlayerResult(round, '3'),
      })),
    }
    setIsExporting(true)
    fetch(
      `${import.meta.env.VITE_HOMEPAGE_HOST}/api/match/${
        exportedMatch._id
      }/result`,
      {
        method: 'PATCH',
        body: JSON.stringify(exportedMatch),
        headers: {
          Accept: 'application/json',
        },
      }
    ).then(() => {
      setIsExported(true)
      setIsExporting(false)
      alert('上傳完畢，請在資料庫上查看。')
    })
  }, [match, matchId, matchRounds])

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <div>
          <h6 className="text-center text-sm">{matchId}</h6>
          <h3 className="text-2xl text-center">{match.name}</h3>
        </div>

        <MJMatchHistoryTable
          players={match.players}
          matchRounds={matchRounds}
          className="w-full table-auto"
        />

        <div className="text-center">
          {!isExported && (
            <MJUIButton disabled={isExporting} onClick={handleClickExport}>
              {isExporting ? '上傳中…' : '上傳成績'}
            </MJUIButton>
          )}
          {isExported && (
            <a
              href={`${
                import.meta.env.VITE_CMS_HOST
              }/structure/general-list-matches-past;${matchId}`}
            >
              <MJUIButton color="secondary">在資料庫上查看</MJUIButton>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
