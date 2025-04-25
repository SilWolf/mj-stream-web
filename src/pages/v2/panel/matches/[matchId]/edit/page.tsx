import { generateMatchRoundCode } from '@/helpers/mahjong.helper'
import { RealtimeMatch, RealtimeMatchRound } from '@/models'
import useCurrentTournament from '@/pages/v2/hooks/useCurrentTournament'
import { V2Match } from '@/pages/v2/models/V2Match.model'
import { apiGetMatchById } from '@/pages/v2/services/match.service'
import V2MatchForm from '@/pages/v2/widgets/V2MatchForm'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useLocation, useParams, useSearchParams } from 'wouter'

export default function V2PanelMatchesByIdEditPage() {
  const fb = useFirebaseDatabase()
  const { matchId } = useParams<{ matchId: string }>()
  const [searchParams] = useSearchParams()
  const [, navigate] = useLocation()

  const {
    data: { tournament, playersMap },
  } = useCurrentTournament()

  const { data: match } = useQuery({
    queryKey: ['v2-matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchById(queryKey[1]),
  })

  const handleSubmit = useCallback(
    async (newMatch: V2Match) => {
      if (!match) {
        return
      }
      if (!confirm('確定資料都正確了嗎？要開始對局了嗎？')) {
        return
      }

      const newMatchId = getRandomId()

      const newRTMatch: RealtimeMatch = {
        code: newMatchId,
        name: newMatch.data.name,
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
          '0': {
            primaryName: newMatch.data.players[0].name.display.primary,
            secondaryName:
              newMatch.data.players[0].name.display.secondary ?? '',
            nickname: newMatch.data.players[0].name.display.third ?? '',
            color: newMatch.data.players[0].color.primary,
            logoUrl: newMatch.data.players[0].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[0].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[0].image.riichi?.default.url ??
              newMatch.data.players[0].image.logo?.default.url ??
              '',
          },
          '1': {
            primaryName: newMatch.data.players[1].name.display.primary,
            secondaryName:
              newMatch.data.players[1].name.display.secondary ?? '',
            nickname: newMatch.data.players[1].name.display.third ?? '',
            color: newMatch.data.players[1].color.primary,
            logoUrl: newMatch.data.players[1].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[1].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[1].image.riichi?.default.url ??
              newMatch.data.players[1].image.logo?.default.url ??
              '',
          },
          '2': {
            primaryName: newMatch.data.players[2].name.display.primary,
            secondaryName:
              newMatch.data.players[2].name.display.secondary ?? '',
            nickname: newMatch.data.players[2].name.display.third ?? '',
            color: newMatch.data.players[2].color.primary,
            logoUrl: newMatch.data.players[2].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[2].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[2].image.riichi?.default.url ??
              newMatch.data.players[2].image.logo?.default.url ??
              '',
          },
          '3': {
            primaryName: newMatch.data.players[3].name.display.primary,
            secondaryName:
              newMatch.data.players[3].name.display.secondary ?? '',
            nickname: newMatch.data.players[3].name.display.third ?? '',
            color: newMatch.data.players[3].color.primary,
            logoUrl: newMatch.data.players[3].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[3].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[3].image.riichi?.default.url ??
              newMatch.data.players[3].image.logo?.default.url ??
              '',
          },
        },
        activeResultDetail: null,
      }

      await fb.set(`matches/${newRTMatch.code}`, newRTMatch)

      const startingScore = 25000

      const matchRound: RealtimeMatchRound = {
        matchId: newRTMatch.code,
        code: generateMatchRoundCode(newRTMatch.code, 1, 0),
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
      await fb.update(`obs/1`, {
        matchId: newRTMatch.code,
        themeId: tournament?.themeId ?? 'default',
      })
      navigate('/obs/match-control')
    },
    [fb, match, navigate, tournament?.themeId]
  )

  const defaultValues = useMemo(() => {
    if (!match) {
      return undefined
    }

    return {
      name: match.data.name,
      rulesetId: match.data.rulesetRef,
      players: [
        playersMap[match.data.players[0].id] ?? match.data.players[0],
        playersMap[match.data.players[1].id] ?? match.data.players[1],
        playersMap[match.data.players[2].id] ?? match.data.players[2],
        playersMap[match.data.players[3].id] ?? match.data.players[3],
      ].map((player) => ({
        namePrimary: player.name.display.primary,
        nameSecondary: player.name.display.secondary ?? '',
        nameThird: player.name.display.third ?? '',
        colorPrimary: player.color.primary,
        colorSecondary: player.color.secondary ?? player.color.primary,
        imagePortraitUrl: player.image.portrait?.default.url,
        imageLogoUrl: player.image.logo?.default.url,
        imageRiichiUrl:
          player.image.riichi?.default.url ?? player.image.logo?.default.url,
      })),
    }
  }, [match, playersMap])

  if (!match) {
    return <></>
  }

  return (
    <>
      <section className="container mx-6 my-4">
        <V2MatchForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          autoSubmit={!!searchParams.get('autoSubmit')}
        />
      </section>
    </>
  )
}
