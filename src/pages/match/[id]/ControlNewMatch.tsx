import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJUIButton from '@/components/MJUI/MJUIButton'
import {
  DB_Match,
  DB_TeamPlayer,
  convertDbTeamPlayerToPlayer,
} from '@/helpers/sanity.helper'
import { getYakuMaxLabel, getYakumanMaxLabel } from '@/utils/string.util'
import { useCallback } from 'react'
import { Match, MatchRound } from '@/models'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { generateMatchRoundCode } from '@/helpers/mahjong.helper'

type Props = {
  dbMatch: DB_Match
}

const DBTeamPlayerDiv = ({ teamPlayer }: { teamPlayer: DB_TeamPlayer }) => {
  return (
    <MJPlayerCardDiv
      player={convertDbTeamPlayerToPlayer(teamPlayer)}
      score={25000}
    />
  )
}

const ControlNewMatch = ({ dbMatch }: Props) => {
  const fb = useFirebaseDatabase()

  const handleClickStart = useCallback(async () => {
    if (!confirm('確定資料都正確了嗎？要開始對局了嗎？')) {
      return
    }

    const newMatch: Match = {
      code: dbMatch._id,
      name: dbMatch.name,
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      setting: {
        startingScore: dbMatch.tournament.startingScore,
        isManganRoundUp: dbMatch.tournament.startingScore ? '1' : '0',
        yakuMax: dbMatch.tournament.yakuMax,
        yakumanMax: dbMatch.tournament.yakumanMax,
      },
      players: {
        '0': convertDbTeamPlayerToPlayer(dbMatch.playerEast),
        '1': convertDbTeamPlayerToPlayer(dbMatch.playerSouth),
        '2': convertDbTeamPlayerToPlayer(dbMatch.playerWest),
        '3': convertDbTeamPlayerToPlayer(dbMatch.playerNorth),
      },
      activeResultDetail: null,
    }

    await fb.set(`matches/${dbMatch._id}`, newMatch)

    const startingScore = parseInt(dbMatch.tournament.startingScore)

    const matchRound: MatchRound = {
      matchId: dbMatch._id,
      code: generateMatchRoundCode(dbMatch._id, 1, 0),
      roundCount: 1,
      extendedRoundCount: 0,
      cumulatedThousands: 0,
      nextRoundCumulatedThousands: 0,
      resultType: 0,
      nextRoundType: 0,
      playerResults: {
        '0': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
        '1': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
        '2': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
        '3': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
      },
      doras: [],
    }

    await fb.push(`matchRounds`, matchRound)
    await fb.set(`obs/1`, { matchId: dbMatch._id })
  }, [
    dbMatch._id,
    dbMatch.name,
    dbMatch.playerEast,
    dbMatch.playerNorth,
    dbMatch.playerSouth,
    dbMatch.playerWest,
    dbMatch.tournament.startingScore,
    dbMatch.tournament.yakuMax,
    dbMatch.tournament.yakumanMax,
    fb,
  ])

  return (
    <div className="container mx-auto max-w-screen-md py-16">
      <div className="space-y-6">
        <div className="bg-red-500 p-4 text-white space-y-2">
          <div className="text-center text-6xl">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <p className="text-center text-xl">
            這是開始直播前的最後機會，請檢查以下內容是否完全正確。
            <br />
            一旦對局開始，要修改內容就很麻煩。
            <br />
            <br />
            如果要修改，請在資料庫修改後，刷新此頁面。
          </p>
        </div>

        <h4 className="text-3xl">
          <span className="text-neutral-600">對局名稱:</span>{' '}
          <span className="font-bold">{dbMatch.name}</span>
        </h4>

        <div className="grid grid-cols-10 gap-x-2">
          <div className="col-span-4 col-start-4">
            <div className="text-[48px]">
              <DBTeamPlayerDiv teamPlayer={dbMatch.playerWest} />
            </div>
            <p className="text-center text-4xl">西</p>
          </div>
          <div className="col-span-4 col-start-1 flex items-center gap-x-2">
            <div className="flex-1 text-[48px]">
              <DBTeamPlayerDiv teamPlayer={dbMatch.playerNorth} />
            </div>
            <div className="shrink-0 text-4xl">北</div>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-4 flex items-center gap-x-2">
            <div className="shrink-0 text-4xl">南</div>
            <div className="flex-1 text-[48px]">
              <DBTeamPlayerDiv teamPlayer={dbMatch.playerSouth} />
            </div>
          </div>
          <div className="col-span-4 col-start-4">
            <p className="text-center text-4xl">東</p>
            <div className="text-[48px]">
              <DBTeamPlayerDiv teamPlayer={dbMatch.playerEast} />
            </div>
          </div>
        </div>

        <div className="text-2xl">
          <span className="text-neutral-600">聯賽:</span>{' '}
          <span className="font-bold">{dbMatch.tournament.name}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="border border-neutral-400 pt-2 py-4 rounded text-center bg-white">
            <p className="text-neutral-600 font-bold text-sm">起始點數</p>
            <p className="text-4xl">{dbMatch.tournament.startingScore}</p>
          </div>

          <div className="border border-neutral-400 pt-2 py-4 rounded text-center bg-white">
            <p className="text-neutral-600 font-bold text-sm">切上滿貫</p>
            <p className="text-4xl">
              {dbMatch.tournament.isManganRoundUp ? '有' : '沒有'}
            </p>
          </div>

          <div className="border border-neutral-400 pt-2 py-4 rounded text-center bg-white">
            <p className="text-neutral-600 font-bold text-sm">翻數上限</p>
            <p className="text-4xl">
              {getYakuMaxLabel(dbMatch.tournament.yakuMax)}
            </p>
          </div>

          <div className="border border-neutral-400 pt-2 py-4 rounded text-center bg-white">
            <p className="text-neutral-600 font-bold text-sm">役滿上限</p>
            <p className="text-4xl">
              {getYakumanMaxLabel(dbMatch.tournament.yakumanMax)}
            </p>
          </div>
        </div>

        <div className="pt-8">
          <MJUIButton
            className="w-full"
            size="xlarge"
            variant="contained"
            color="success"
            onClick={handleClickStart}
          >
            確認以上內容無誤，開始對局
          </MJUIButton>
        </div>
      </div>
    </div>
  )
}

export default ControlNewMatch
