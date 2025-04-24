import React, { useCallback, useMemo } from 'react'
import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '@/providers/firebaseDatabase.provider'
import { generateMatchRoundCode } from '@/helpers/mahjong.helper'
import V2MatchForm from '../../widgets/V2MatchForm'
import { useToggle } from 'react-use'
import { useLocation } from 'wouter'
import { getRulesetById } from '../../services/api.service'
import { V2Match } from '../../models/V2Match.model'
import { V2MatchRound } from '../../models/V2MatchRound.model'
import { V2ObsRoom } from '../../models/V2ObsRoom.model'

export default function V2CreateMatchPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, navigate] = useLocation()
  const fb = useFirebaseDatabase()
  const { data: obsRoom, update: updateObsRoom } = useFirebaseDatabaseByKey<
    string,
    V2ObsRoom
  >(`obs/1`)

  const [isCreating, toggleIsCreating] = useToggle(false)

  const handleSubmitMatchForm = useCallback(
    async (newMatch: V2Match) => {
      const ruleset = await getRulesetById(newMatch.data.rulesetRef)
      if (!ruleset) {
        return
      }

      if (!confirm('確定資料都正確了嗎？要開始對局了嗎？')) {
        return
      }

      toggleIsCreating()

      const matchPayload = {
        ...newMatch,
        data: {
          ...newMatch.data,
          players: new Array(ruleset.data.playerCount)
            .fill(undefined)
            .map((_, playerIndex) => newMatch.data.players[playerIndex]),
        },
      } satisfies V2Match

      await fb.set(
        `matches/${newMatch.code}`,
        JSON.parse(JSON.stringify(matchPayload))
      )

      const startingScore = ruleset.data.startingPoint

      const matchRound: V2MatchRound = {
        schemaVersion: 'v20250403',
        matchId: newMatch.code,
        code: generateMatchRoundCode(newMatch.code, 1, 0),
        initial: {
          roundCount: 1,
          extendedRoundCount: 0,
          jackpot: 0,
          players: new Array(ruleset.data.playerCount)
            .fill(undefined)
            .map(() => ({
              score: startingScore,
            })),
        },
        progress: {
          doras: [],
          players: new Array(ruleset.data.playerCount)
            .fill(undefined)
            .map(() => ({
              waitingTiles: [],
              predictedYakus: '',
              flag: {
                __placeholder: true,
              },
            })),
        },
        metadata: newMatch.metadata,
      }

      await fb.push(`matchRounds`, JSON.parse(JSON.stringify(matchRound)))
      updateObsRoom({
        activeMatchId: newMatch.code,
      })

      toggleIsCreating(false)
      navigate('/obs/control/match')
    },
    [fb, navigate, toggleIsCreating, updateObsRoom]
  )

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-start gap-x-4">
        <h2 className="font-bold text-lg mb-8">創建新對局</h2>
      </div>

      <V2MatchForm onSubmit={handleSubmitMatchForm} />

      {isCreating && (
        <div className="fixed z-50 inset-0 bg-base-100/90 flex justify-center items-center">
          <div className="text-center space-y-8">
            <span className="loading loading-spinner text-primary"></span>
            <p className="text-lg">創建賽事中，請稍候……</p>
          </div>
        </div>
      )}
    </div>
  )
}
