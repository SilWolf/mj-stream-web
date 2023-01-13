import React, { useCallback, useEffect } from 'react'
import { Match, MatchRound } from '@/models'
import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'
import { useLocation } from 'wouter'

export default function DevPage() {
  const fb = useFirebaseDatabase()
  const { data } = useFirebaseDatabaseByKey('players')
  const [_, setLocation] = useLocation()

  const handleClickGenerateTestData = useCallback(async () => {
    // try to generate fake data
    const players = {
      JR4KErxY1b5Q: {
        id: 'JR4KErxY1b5Q',
        code: '00001',
        name: '多井隆晴',
      },
      oAYR08k8XTZY: {
        id: 'oAYR08k8XTZY',
        code: '00002',
        name: '丸山奏子',
      },
      tdNEkAI_VQj4: {
        id: 'tdNEkAI_VQj4',
        code: '00003',
        name: '勝又健志',
      },
      aCcV3PmRYRsa: {
        id: 'aCcV3PmRYRsa',
        code: '00004',
        name: '二階堂亞樹',
      },
    }

    await fb.set(`players`, players)

    const matchId = getRandomId()
    const match: Match = {
      id: matchId,
      code: '20230114-001',
      players: {
        0: { id: 'oAYR08k8XTZY', score: 25000, rank: 1, point: 0 },
        1: { id: 'aCcV3PmRYRsa', score: 25000, rank: 1, point: 0 },
        2: { id: 'JR4KErxY1b5Q', score: 25000, rank: 1, point: 0 },
        3: { id: 'tdNEkAI_VQj4', score: 25000, rank: 1, point: 0 },
      },
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      setting: {
        template: 'mleague',
      },
    }

    await fb.set(`matches/${matchId}`, match)

    const matchRoundId = getRandomId()
    const matchRound: MatchRound = {
      id: matchRoundId,
      matchId,
      code: '20230114-001-1.0',
      counter: '1.0',
      jackpot: 0,
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

    await fb.set(`matchRounds/${matchId}/active`, matchRound)

    setLocation(`/match/${matchId}`)
  }, [fb, setLocation])

  useEffect(() => {
    console.log(data)
  }, [data])

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
