import React, { useCallback } from 'react'
import { MatchRound } from '@/models'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { useLocation } from 'wouter'

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
      subRoundCount: 1,
      cumulatedThousands: 2,
      resultType: 0,
      playerResults: {
        0: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
        },
        1: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
        },
        2: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
        },
        3: {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
        },
      },
      doras: ['7p'],
    }

    await fb.push(`matchRounds`, matchRound)

    setLocation(`/match/${matchRound.matchId}`)
  }, [fb, setLocation])

  return (
    <div className="space-y-6">
      <div>
        <button type="button" onClick={handleClickGenerateTestData}>
          生成測試數據及打開 /match/:matchId
        </button>
      </div>
    </div>
  )
}
