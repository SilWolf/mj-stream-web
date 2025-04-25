import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJUIButton from '@/components/MJUI/MJUIButton'
import { convertDbTeamPlayerToRealtimePlayer } from '@/helpers/sanity.helper'
import { useCallback } from 'react'
import {
  Match,
  Player,
  RealtimeMatch,
  RealtimeMatchRound,
  RealtimePlayer,
  Team,
} from '@/models'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { generateMatchRoundCode } from '@/helpers/mahjong.helper'

type Props = {
  match: Match
}

const DBTeamPlayerDiv = ({
  team,
  player,
}: {
  team: Team | undefined
  player: Player | undefined
}) => {
  if (!team || !player) {
    return <></>
  }

  const realtimePlayer: RealtimePlayer = convertDbTeamPlayerToRealtimePlayer(
    team,
    player
  )

  return (
    <MJPlayerCardDiv player={realtimePlayer} playerIndex="0" score={25000} />
  )
}

const ControlNewMatch = ({ match }: Props) => {
  const fb = useFirebaseDatabase()

  const handleClickStart = useCallback(async () => {
    if (!confirm('確定資料都正確了嗎？要開始對局了嗎？')) {
      return
    }

    const newMatch: RealtimeMatch = {
      code: match._id,
      name: match.name,
      databaseId: match._id,
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      setting: {
        startingScore: '25000',
        isManganRoundUp: '1',
        yakuMax: '12',
        yakumanMax: '13',
      },
      players: {
        '0': convertDbTeamPlayerToRealtimePlayer(
          match.playerEastTeam!,
          match.playerEast!
        ),
        '1': convertDbTeamPlayerToRealtimePlayer(
          match.playerSouthTeam!,
          match.playerSouth!
        ),
        '2': convertDbTeamPlayerToRealtimePlayer(
          match.playerWestTeam!,
          match.playerWest!
        ),
        '3': convertDbTeamPlayerToRealtimePlayer(
          match.playerNorthTeam!,
          match.playerNorth!
        ),
      },
      activeResultDetail: null,
    }

    await fb.set(`matches/${match._id}`, newMatch)

    const startingScore = 25000

    const matchRound: RealtimeMatchRound = {
      matchId: match._id,
      code: generateMatchRoundCode(match._id, 1, 0),
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
    await fb.update(`obs/1`, { matchId: match._id })
  }, [
    fb,
    match._id,
    match.name,
    match.playerEast,
    match.playerEastTeam,
    match.playerNorth,
    match.playerNorthTeam,
    match.playerSouth,
    match.playerSouthTeam,
    match.playerWest,
    match.playerWestTeam,
  ])

  return (
    <div className="container mx-auto max-w-(--breakpoint-md) py-16">
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
          <span className="font-bold">{match.name}</span>
        </h4>

        <div className="grid grid-cols-10 gap-x-2">
          <div className="col-span-4 col-start-4">
            <div className="text-[48px]">
              <DBTeamPlayerDiv
                team={match.playerWestTeam}
                player={match.playerWest}
              />
            </div>
            <p className="text-center text-4xl">西</p>
          </div>
          <div className="col-span-4 col-start-1 flex items-center gap-x-2">
            <div className="flex-1 text-[48px]">
              <DBTeamPlayerDiv
                team={match.playerNorthTeam}
                player={match.playerNorth}
              />
            </div>
            <div className="shrink-0 text-4xl">北</div>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-4 flex items-center gap-x-2">
            <div className="shrink-0 text-4xl">南</div>
            <div className="flex-1 text-[48px]">
              <DBTeamPlayerDiv
                team={match.playerSouthTeam}
                player={match.playerSouth}
              />
            </div>
          </div>
          <div className="col-span-4 col-start-4">
            <p className="text-center text-4xl">東</p>
            <div className="text-[48px]">
              <DBTeamPlayerDiv
                team={match.playerEastTeam}
                player={match.playerEast}
              />
            </div>
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
