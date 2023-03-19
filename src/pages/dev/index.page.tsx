import React, { useCallback, useState } from 'react'
import { MatchRound } from '@/models'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { useLocation } from 'wouter'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJTileKeyboardDiv from '@/components/MJTileKeyboardDiv'
import MJRiichiBgDiv from '@/components/MJRiichiBgDiv'

export default function DevPage() {
  const fb = useFirebaseDatabase()
  const [, setLocation] = useLocation()

  const handleClickGenerateTestData = useCallback(async () => {
    // try to generate fake data
    const players = [
      {
        code: '00001',
        name: '多井隆晴',
      },
      {
        code: '00002',
        name: '丸山奏子',
      },
      {
        code: '00003',
        name: '勝又健志',
      },
      {
        code: '00004',
        name: '二階堂亞樹',
      },
    ]

    const playerIds = await Promise.all(
      players.map((player) => fb.push('players', player))
    ).then((result) => result.map((playerRef) => playerRef.key))

    // const matchId = getRandomId()
    const match = {
      code: '20230114-001',
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      setting: {
        template: 'mleague',
      },
      [`player_${playerIds[0]}`]: {
        position: 0,
        score: 25000,
        rank: 1,
        point: 0,
      },
      [`player_${playerIds[1]}`]: {
        position: 1,
        score: 25000,
        rank: 1,
        point: 0,
      },
      [`player_${playerIds[2]}`]: {
        position: 2,
        score: 25000,
        rank: 1,
        point: 0,
      },
      [`player_${playerIds[3]}`]: {
        position: 3,
        score: 25000,
        rank: 1,
        point: 0,
      },
    }

    const matchRef = await fb.push(`matches`, match)

    const matchRound: MatchRound = {
      matchId: matchRef.key as string,
      code: '20230114-001-1.0',
      roundCount: 1,
      extendedRoundCount: 1,
      cumulatedThousands: 2,
      resultType: 0,
      playerResults: {
        0: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        1: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        2: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        3: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
      },
      doras: ['7p'],
    }

    await fb.push(`matchRounds`, matchRound)

    setLocation(`/match/${matchRound.matchId}`)
  }, [fb, setLocation])

  const [score, setScore] = useState<number>(25000)
  const [scoreChanges, setScoreChanges] = useState<number[]>([])

  const handleClickAdd = useCallback(() => {
    setScore((prev) => prev + 2000)
    setScoreChanges([2000])
  }, [])

  const handleClickMinus = useCallback(() => {
    setScore((prev) => prev - 3000)
    setScoreChanges([-1000, -2000])
  }, [])

  return (
    <div className="container mx-auto max-w-screen-md">
      <div className="space-y-6">
        <div>
          <MJUIButton type="button" onClick={handleClickGenerateTestData}>
            生成測試數據及打開 /match/:matchId
          </MJUIButton>
        </div>

        <div>
          <div className="text-[4rem]">
            <MJPlayerCardDiv
              name="測試機械人"
              score={score}
              scoreChanges={scoreChanges}
              className="!bg-yellow-400 !bg-opacity-60"
            />
          </div>
          <MJUIButton onClick={handleClickAdd}>增加</MJUIButton>
          <MJUIButton onClick={handleClickMinus}>減少</MJUIButton>
        </div>

        <div>
          <MJTileKeyboardDiv />
        </div>

        <div>
          <MJRiichiBgDiv className="w-32 h-32" />
        </div>
      </div>
    </div>
  )
}
