import React, { MouseEvent, useCallback, useMemo, useState } from 'react'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import {
  RealtimeMatch,
  RealtimeMatchRound,
  NextRoundTypeEnum,
  PlayerIndex,
  PlayerResult,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
  RealtimePlayer,
} from '@/models'
import { useConfirmDialog } from '@/components/ConfirmDialog/provider'
import {
  distributeThousandsToPlayers,
  formatPlayerResultsByPreviousPlayerResults,
  generateMatchRoundCode,
  getAfterOfPlayerIndex,
  getBeforeOfPlayerIndex,
  getOppositeOfPlayerIndex,
  getPlayerIndexOfEastByRound,
} from '@/helpers/mahjong.helper'
import { useBoolean } from 'react-use'
import MJTileDiv, { MJTileKey } from '@/components/MJTileDiv'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileKeyboardDiv from '@/components/MJTileKeyboardDiv'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import MJUIButton from '@/components/MJUI/MJUIButton'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import PlayersListView from './components/PlayersView/PlayersListView'
import { PlayersViewAction } from './components/PlayersView'
import {
  MJYakuKeyboardDialog,
  MJYakuKeyboardResult,
} from '@/components/MJYakuKeyboardDiv'
import MJAmountSpan from '@/components/MJAmountSpan'
import MJMatchRonForm, {
  MJMatchRonFormProps,
} from '@/components/MJMatchRonForm'
import MJHanFuTextSpan from '@/components/MJHanFuTextSpan'
import MJMatchExhaustedForm from '@/components/MJMatchExhaustedForm'
import MJMatchHotfixForm from '@/components/MJMatchHotifxForm'
import MJMatchRoundEditForm, {
  MJMatchRoundEditFormProps,
} from '@/components/MJMatchRoundEditForm'
import MJPlayersForm from '@/components/MJPlayersForm'

function MJMatchHistoryAmountSpan({ value }: { value: number }) {
  return (
    <MJAmountSpan
      value={value}
      positiveClassName="text-green-600"
      negativeClassName="text-red-600"
      signed
      hideZero
    />
  )
}

const PlayerResultMetadata = ({
  rtMatch,
  rtMatchRound,
  playerIndex,
}: {
  rtMatch: RealtimeMatch
  rtMatchRound: RealtimeMatchRound
  playerIndex: PlayerIndex
}) => {
  return (
    <div className="text-xs">
      <p>
        {rtMatchRound.playerResults[playerIndex].isRiichi && <span>立</span>}
        {rtMatchRound.resultType === RoundResultTypeEnum.Ron &&
          rtMatchRound.playerResults[playerIndex].type ===
            PlayerResultWinnerOrLoserEnum.Lose && <span>統</span>}
        {rtMatchRound.resultType === RoundResultTypeEnum.Ron &&
          rtMatchRound.playerResults[playerIndex].type ===
            PlayerResultWinnerOrLoserEnum.Win && <span>和</span>}
        {rtMatchRound.resultType === RoundResultTypeEnum.SelfDrawn &&
          rtMatchRound.playerResults[playerIndex].type ===
            PlayerResultWinnerOrLoserEnum.Win && <span>摸</span>}
        {rtMatchRound.resultType === RoundResultTypeEnum.Exhausted &&
          rtMatchRound.playerResults[playerIndex].type ===
            PlayerResultWinnerOrLoserEnum.Win && <span>聽</span>}
      </p>
      {rtMatchRound.playerResults[playerIndex].isRonDisallowed && (
        <p className="text-red-500 font-semibold">和了禁止</p>
      )}
      {(rtMatchRound.resultType === RoundResultTypeEnum.Ron ||
        rtMatchRound.resultType === RoundResultTypeEnum.SelfDrawn) &&
        rtMatchRound.playerResults[playerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Win && (
          <div className="bg-base-200 rounded-sm py-1 px-2 mx-auto inline-block">
            <p className="font-bold">
              <MJHanFuTextSpan
                className="text-xs text-base-content"
                han={rtMatchRound.playerResults[playerIndex].detail.han}
                fu={rtMatchRound.playerResults[playerIndex].detail.fu}
                yakumanCount={
                  rtMatchRound.playerResults[playerIndex].detail.yakumanCount
                }
                isManganRoundUp={rtMatch.setting.isManganRoundUp === '1'}
              />
            </p>
            <p>
              {rtMatchRound.playerResults[playerIndex].detail.yakus
                ?.map(({ label }) => label)
                .join(' ')}
            </p>
          </div>
        )}
    </div>
  )
}

type Props = {
  params: { matchId: string }
}

export default function MatchControlPage({ params: { matchId } }: Props) {
  const { data: obsInfo, set: setObsInfo } =
    useFirebaseDatabaseByKey<string>('obs/1')

  const {
    rtMatch,
    rtMatchRounds,
    rtMatchCurrentRound,
    rtMatchCurrentRoundDoras,
    updateMatchRoundById,
    updateCurrentMatchRound,
    pushMatchRound,
    setCurrentRoundDoras,
    setMatchName,
    setMatchPlayers,
    setMatchPointDisplay,
    setMatchHideHeaderDisplay,
    setMatchHidePlayersDisplay,
    setMatchActiveResultDetail,
    setMatchRoundHasBroadcastedToTrue,
  } = useRealtimeMatch(matchId)

  const matchRoundsWithDetail = useMemo(
    () =>
      Object.entries(rtMatchRounds ?? {}).map(
        ([rtMatchRoundId, rtMatchRound]) => ({
          id: rtMatchRoundId,
          ...rtMatchRound,
        })
      ) ?? [],
    [rtMatchRounds]
  )

  const unboardcastedMatchRounds = useMemo(
    () =>
      matchRoundsWithDetail.filter(
        ({ resultDetail, hasBroadcasted }) => !!resultDetail && !hasBroadcasted
      ),
    [matchRoundsWithDetail]
  )

  const [clickedDoraIndex, setClickedDoraIndex] = useState<number | undefined>(
    undefined
  )

  const [isShowingRonDialog, toggleRonDialog] = useBoolean(false)
  const [ronDialogProps, setRonDialogProps] = useState<
    Pick<
      MJMatchRonFormProps,
      'initialActivePlayerIndex' | 'initialTargetPlayerIndex'
    >
  >({ initialActivePlayerIndex: '0', initialTargetPlayerIndex: '-1' })
  const confirmDialog = useConfirmDialog()

  const [isShowingExhaustedDialog, toggleExhaustedDialog] = useBoolean(false)

  const [isShowingEditPlayersDialog, toggleEditPlayersDialog] =
    useBoolean(false)
  const handleClickEditPlayers = useCallback(() => {
    toggleEditPlayersDialog(true)
  }, [toggleEditPlayersDialog])
  const handleSubmitPlayersForm = useCallback(
    (newPlayers: Record<PlayerIndex, RealtimePlayer>) => {
      setMatchPlayers(newPlayers)
      toggleEditPlayersDialog(false)
    },
    [setMatchPlayers, toggleEditPlayersDialog]
  )

  const [isShowingHotfixDialog, toggleHotfixDialog] = useBoolean(false)

  const [isShowingEditDialog, toggleEditDialog] = useBoolean(false)
  const [editDialogProps, setEditDialogProps] = useState<
    Pick<MJMatchRoundEditFormProps, 'rtMatchRound'> & { id: string | null }
  >({ id: null, rtMatchRound: null })

  const handleClickEditMatchRound = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const matchRoundId = e.currentTarget.getAttribute('data-matchRoundId')
      if (!matchRoundId) {
        return
      }

      const rtMatchRound = rtMatchRounds?.[matchRoundId]
      if (!rtMatchRound) {
        return
      }

      setEditDialogProps({ id: matchRoundId, rtMatchRound })
      toggleEditDialog(true)
    },
    [rtMatchRounds, toggleEditDialog]
  )

  const handleSubmitRoundEdit = useCallback(
    (newMatchRound: RealtimeMatchRound) => {
      if (!matchRoundsWithDetail || !editDialogProps.id) {
        return
      }

      const foundIndex = matchRoundsWithDetail.findIndex(
        ({ id }) => id === editDialogProps.id
      )
      if (foundIndex === -1) {
        return
      }

      updateMatchRoundById(editDialogProps.id, newMatchRound)
      let prevRound = newMatchRound

      for (let i = foundIndex + 1; i < matchRoundsWithDetail.length; i++) {
        const { id: oldNextMatchId, ...oldNextMatchRound } =
          matchRoundsWithDetail[i]
        const newNextMatchRound: RealtimeMatchRound = {
          ...oldNextMatchRound,
          playerResults: {
            '0': {
              ...oldNextMatchRound.playerResults['0'],
              beforeScore: prevRound.playerResults['0'].afterScore,
              afterScore:
                prevRound.playerResults['0'].afterScore +
                (oldNextMatchRound.playerResults['0'].afterScore -
                  oldNextMatchRound.playerResults['0'].beforeScore),
            },
            '1': {
              ...oldNextMatchRound.playerResults['1'],
              beforeScore: prevRound.playerResults['1'].afterScore,
              afterScore:
                prevRound.playerResults['1'].afterScore +
                (oldNextMatchRound.playerResults['1'].afterScore -
                  oldNextMatchRound.playerResults['1'].beforeScore),
            },
            '2': {
              ...oldNextMatchRound.playerResults['2'],
              beforeScore: prevRound.playerResults['2'].afterScore,
              afterScore:
                prevRound.playerResults['2'].afterScore +
                (oldNextMatchRound.playerResults['2'].afterScore -
                  oldNextMatchRound.playerResults['2'].beforeScore),
            },
            '3': {
              ...oldNextMatchRound.playerResults['3'],
              beforeScore: prevRound.playerResults['3'].afterScore,
              afterScore:
                prevRound.playerResults['3'].afterScore +
                (oldNextMatchRound.playerResults['3'].afterScore -
                  oldNextMatchRound.playerResults['3'].beforeScore),
            },
          },
        }

        updateMatchRoundById(oldNextMatchId, newNextMatchRound)
        prevRound = newNextMatchRound
      }
      toggleEditDialog(false)

      setTimeout(() => {
        alert('「下次小心d喇屌 :)」')
      }, 0)
    },
    [
      editDialogProps.id,
      matchRoundsWithDetail,
      toggleEditDialog,
      updateMatchRoundById,
    ]
  )

  const [, setActiveAnimationMessage] = useState<string | null>(null)

  const handleClickDora = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const doraIndex = parseInt(
        e.currentTarget?.getAttribute('data-index') as string,
        10
      )

      if (typeof doraIndex !== 'undefined' && !Number.isNaN(doraIndex)) {
        setClickedDoraIndex(doraIndex)
      }
    },
    []
  )

  const handleSubmitDoraKeyboard = useCallback(
    (tileKeys: MJTileKey[]) => {
      if (typeof clickedDoraIndex !== 'undefined') {
        const tileKey = tileKeys[0]
        if (!tileKey) {
          return
        }

        const newDoras = [...rtMatchCurrentRoundDoras]

        if (clickedDoraIndex === -1) {
          newDoras.push(tileKey)
        } else {
          newDoras[clickedDoraIndex] = tileKey
        }

        setCurrentRoundDoras(newDoras)
        setClickedDoraIndex(undefined)
      }
    },
    [clickedDoraIndex, rtMatchCurrentRoundDoras, setCurrentRoundDoras]
  )

  const handleRemoveDoraKeyboard = useCallback(() => {
    if (typeof clickedDoraIndex !== 'undefined') {
      const newDoras = [...rtMatchCurrentRoundDoras]

      if (clickedDoraIndex > -1) {
        newDoras.splice(clickedDoraIndex, 1)
        setCurrentRoundDoras(newDoras)
        setClickedDoraIndex(undefined)
      }
    }
  }, [clickedDoraIndex, rtMatchCurrentRoundDoras, setCurrentRoundDoras])

  const handleCloseDoraKeyboard = useCallback(() => {
    setClickedDoraIndex(undefined)
  }, [])

  const handleClickExhausted = useCallback(() => {
    toggleExhaustedDialog(true)
  }, [toggleExhaustedDialog])

  const handleClickHotfix = useCallback(() => {
    toggleHotfixDialog(true)
  }, [toggleHotfixDialog])

  const handlePlayerListViewAction = useCallback(
    (
      playerIndex: PlayerIndex,
      action: PlayersViewAction,
      payload?: unknown
    ) => {
      if (!rtMatch || !rtMatchCurrentRound) {
        return
      }

      const player = rtMatch.players[playerIndex]
      const playerResult = rtMatchCurrentRound.playerResults[playerIndex]

      switch (action) {
        case 'reveal':
          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                isRevealed:
                  !rtMatchCurrentRound.playerResults[playerIndex].isRevealed,
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  isRevealed:
                    !rtMatchCurrentRound.playerResults[playerIndex].isRevealed,
                },
              },
            },
          })

        case 'riichi':
          return confirmDialog.showConfirmDialog({
            title: !playerResult.isRiichi ? '確定要立直嗎？' : '取消立直？',
            content: !playerResult.isRiichi
              ? `一旦點擊確定，就會播出立直動畫，請確定立直的是 ${player.primaryName}！`
              : `你是否想取消 ${player.primaryName} 的立直？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(rtMatchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...rtMatchCurrentRound?.playerResults[playerIndex],
                    isRiichi:
                      !rtMatchCurrentRound?.playerResults[playerIndex].isRiichi,
                    detail: {
                      ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                      isRiichied:
                        !rtMatchCurrentRound.playerResults[playerIndex]
                          .isRiichi,
                      raw: {
                        ...rtMatchCurrentRound.playerResults[playerIndex].detail
                          .raw,
                        riichi:
                          !rtMatchCurrentRound.playerResults[playerIndex]
                            .isRiichi,
                      },
                    },
                  },
                },
              })

              if (!playerResult.isRiichi) {
                setActiveAnimationMessage('立直動畫')
                setTimeout(() => {
                  setActiveAnimationMessage(null)
                }, 2000)
              }
            },
          })

        case 'ron-self':
          updateCurrentMatchRound({
            playerResults: {
              ...(rtMatchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...rtMatchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...rtMatchCurrentRound.playerResults[playerIndex].detail
                      .raw,
                    'menzenchin-tsumohou':
                      !rtMatchCurrentRound?.playerResults[playerIndex].detail
                        .isRevealed,
                  },
                },
              },
            },
          })
          setRonDialogProps({
            initialActivePlayerIndex: playerIndex,
            initialTargetPlayerIndex: '-1',
          })
          toggleRonDialog()
          return

        case 'ron-before':
          updateCurrentMatchRound({
            playerResults: {
              ...(rtMatchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...rtMatchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...rtMatchCurrentRound.playerResults[playerIndex].detail
                      .raw,
                    'menzenchin-tsumohou': false,
                  },
                },
              },
            },
          })
          setRonDialogProps({
            initialActivePlayerIndex: playerIndex,
            initialTargetPlayerIndex: getBeforeOfPlayerIndex(playerIndex),
          })
          toggleRonDialog()
          return

        case 'ron-after':
          updateCurrentMatchRound({
            playerResults: {
              ...(rtMatchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...rtMatchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...rtMatchCurrentRound.playerResults[playerIndex].detail
                      .raw,
                    'menzenchin-tsumohou': false,
                  },
                },
              },
            },
          })
          setRonDialogProps({
            initialActivePlayerIndex: playerIndex,
            initialTargetPlayerIndex: getAfterOfPlayerIndex(playerIndex),
          })
          toggleRonDialog()
          return

        case 'ron-opposite':
          updateCurrentMatchRound({
            playerResults: {
              ...(rtMatchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...rtMatchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...rtMatchCurrentRound.playerResults[playerIndex].detail
                      .raw,
                    'menzenchin-tsumohou': false,
                  },
                },
              },
            },
          })
          setRonDialogProps({
            initialActivePlayerIndex: playerIndex,
            initialTargetPlayerIndex: getOppositeOfPlayerIndex(playerIndex),
          })
          toggleRonDialog()
          return

        case 'dora-normal-plus':
          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  dora:
                    rtMatchCurrentRound.playerResults[playerIndex].detail.dora +
                    1,
                },
              },
            },
          })

        case 'dora-normal-minus':
          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  dora: Math.max(
                    rtMatchCurrentRound.playerResults[playerIndex].detail.dora -
                      1,
                    0
                  ),
                },
              },
            },
          })

        case 'dora-red-plus':
          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  redDora:
                    rtMatchCurrentRound.playerResults[playerIndex].detail
                      .redDora + 1,
                },
              },
            },
          })

        case 'dora-red-minus':
          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  redDora: Math.max(
                    rtMatchCurrentRound.playerResults[playerIndex].detail
                      .redDora - 1,
                    0
                  ),
                },
              },
            },
          })

        case 'waitingTile':
          return setActiveWaitingTilesData({
            index: playerIndex,
            tiles:
              rtMatchCurrentRound?.playerResults[playerIndex].waitingTiles ??
              [],
          })

        case 'yaku':
          return setActivePredictYakusData({
            index: playerIndex,
          })

        case 'yellow-card':
          return confirmDialog.showConfirmDialog({
            title: !playerResult.isYellowCarded
              ? '確定要給予這名玩家黃牌嗎？'
              : '取消黃牌？',
            content: !playerResult.isYellowCarded
              ? `一旦點擊確定，就會播出黃牌動畫，請確定要黃牌的是 ${player.primaryName}！`
              : `你是否想取消 ${player.primaryName} 的黃牌？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(rtMatchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...rtMatchCurrentRound?.playerResults[playerIndex],
                    isYellowCarded:
                      !rtMatchCurrentRound?.playerResults[playerIndex]
                        .isYellowCarded,
                  },
                },
              })
            },
          })

        case 'red-card':
          return confirmDialog.showConfirmDialog({
            title: !playerResult.isRedCarded
              ? '確定要給予這名玩家紅牌嗎？'
              : '取消紅牌？',
            content: !playerResult.isRedCarded
              ? `一旦點擊確定，就會播出紅牌動畫，請確定要紅牌的是 ${player.primaryName}！`
              : `你是否想取消 ${player.primaryName} 的紅牌？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(rtMatchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...rtMatchCurrentRound?.playerResults[playerIndex],
                    isRedCarded:
                      !rtMatchCurrentRound?.playerResults[playerIndex]
                        .isRedCarded,
                  },
                },
              })
            },
          })

        case 'disallow-ron':
          return confirmDialog.showConfirmDialog({
            title: !playerResult.isRedCarded
              ? '確定要給予這名玩家和了禁止嗎？'
              : '取消和了禁止？',
            content: !playerResult.isRedCarded
              ? `一旦點擊確定，就會播出紅牌動畫，請確定要和了禁止的是 ${player.primaryName}！`
              : `你是否想取消 ${player.primaryName} 的和了禁止？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(rtMatchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...rtMatchCurrentRound?.playerResults[playerIndex],
                    isRonDisallowed:
                      !rtMatchCurrentRound?.playerResults[playerIndex]
                        .isRonDisallowed,
                  },
                },
              })
            },
          })

        case 'push-reveal': {
          const newReveals = [
            ...(rtMatchCurrentRound.playerResults[playerIndex].reveals || []),
            payload as string,
          ]

          const isRevealed = newReveals.some(
            (reveal) => reveal.indexOf('0z') === -1
          )

          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                reveals: [
                  ...(rtMatchCurrentRound.playerResults[playerIndex].reveals ||
                    []),
                  payload as string,
                ],
                isRevealed,
                detail: {
                  ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                  isRevealed,
                },
              },
            },
          })
        }

        case 'replace-reveal': {
          const newReveals =
            rtMatchCurrentRound.playerResults[playerIndex].reveals || []
          const [oldReveal, newReveal] = payload as [string, string]
          const indexOfReveal = newReveals.indexOf(oldReveal)
          if (indexOfReveal !== -1) {
            newReveals[indexOfReveal] = newReveal

            const isRevealed = newReveals.some(
              (reveal) => reveal.indexOf('0z') === -1
            )

            return updateCurrentMatchRound({
              playerResults: {
                ...rtMatchCurrentRound.playerResults,
                [playerIndex]: {
                  ...rtMatchCurrentRound.playerResults[playerIndex],
                  reveals: newReveals,
                  isRevealed,
                  detail: {
                    ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                    isRevealed,
                  },
                },
              },
            })
          }

          return
        }

        case 'delete-reveal': {
          const newReveals =
            rtMatchCurrentRound.playerResults[playerIndex].reveals || []
          const oldReveal = payload as string
          const indexOfReveal = newReveals.indexOf(oldReveal)
          if (indexOfReveal !== -1) {
            newReveals.splice(indexOfReveal, 1)

            const isRevealed = newReveals.some(
              (reveal) => reveal.indexOf('0z') === -1
            )

            return updateCurrentMatchRound({
              playerResults: {
                ...rtMatchCurrentRound.playerResults,
                [playerIndex]: {
                  ...rtMatchCurrentRound.playerResults[playerIndex],
                  reveals: newReveals,
                  isRevealed,
                  detail: {
                    ...rtMatchCurrentRound.playerResults[playerIndex].detail,
                    isRevealed,
                  },
                },
              },
            })
          }

          return
        }

        case 'waiting-tile-remain': {
          return updateCurrentMatchRound({
            playerResults: {
              ...rtMatchCurrentRound.playerResults,
              [playerIndex]: {
                ...rtMatchCurrentRound.playerResults[playerIndex],
                waitingTileRemain: payload as number,
              },
            },
          })
        }
      }
    },
    [
      confirmDialog,
      rtMatch,
      rtMatchCurrentRound,
      toggleRonDialog,
      updateCurrentMatchRound,
    ]
  )

  const handleSubmitMatchRonDialog = useCallback(
    (updatedMatchRound: RealtimeMatchRound) => {
      try {
        // Check if rtMatch is over
        const eastPlayerIndex = getPlayerIndexOfEastByRound(
          updatedMatchRound.roundCount
        )
        const isGoExtendedRound =
          updatedMatchRound.playerResults[eastPlayerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Win
        const isGameEnded =
          !isGoExtendedRound && updatedMatchRound.roundCount >= 8

        if (isGameEnded) {
          // TODO: Proceed to Game End
          alert('對局結束。')
        }

        updateCurrentMatchRound({
          ...updatedMatchRound,
          nextRoundType: isGameEnded
            ? NextRoundTypeEnum.End
            : isGoExtendedRound
              ? NextRoundTypeEnum.Extended
              : NextRoundTypeEnum.NextRound,
        })
        toggleRonDialog(false)

        setActiveAnimationMessage('分數變動中…')
        setTimeout(() => {
          setActiveAnimationMessage(null)
        }, 4000)
      } catch (e) {
        console.error(e)
      }
    },
    [toggleRonDialog, updateCurrentMatchRound]
  )

  const handleSubmitMatchExhaustedDialog = useCallback(
    (updatedMatchRound: RealtimeMatchRound) => {
      try {
        const eastPlayerIndex = getPlayerIndexOfEastByRound(
          updatedMatchRound.roundCount
        )
        const isGoNextRound =
          updatedMatchRound.playerResults[eastPlayerIndex].type !==
          PlayerResultWinnerOrLoserEnum.Win
        const isGameEnded = isGoNextRound && updatedMatchRound.roundCount >= 8

        if (isGameEnded) {
          // if game is ended but next round cumlatedThousands exists
          if (updatedMatchRound.nextRoundCumulatedThousands > 0) {
            // distribute to highest score players
            const extraScores = distributeThousandsToPlayers(
              [
                updatedMatchRound.playerResults['0'].afterScore,
                updatedMatchRound.playerResults['1'].afterScore,
                updatedMatchRound.playerResults['2'].afterScore,
                updatedMatchRound.playerResults['3'].afterScore,
              ],
              updatedMatchRound.nextRoundCumulatedThousands * 1000
            )

            if (extraScores[0] !== 0) {
              updatedMatchRound.playerResults['0'].scoreChanges.unshift(
                extraScores[0]
              )
              updatedMatchRound.playerResults['0'].afterScore += extraScores[0]
            }
            if (extraScores[1] !== 0) {
              updatedMatchRound.playerResults['1'].scoreChanges.unshift(
                extraScores[1]
              )
              updatedMatchRound.playerResults['1'].afterScore += extraScores[1]
            }
            if (extraScores[2] !== 0) {
              updatedMatchRound.playerResults['2'].scoreChanges.unshift(
                extraScores[2]
              )
              updatedMatchRound.playerResults['2'].afterScore += extraScores[2]
            }
            if (extraScores[3] !== 0) {
              updatedMatchRound.playerResults['3'].scoreChanges.unshift(
                extraScores[3]
              )
              updatedMatchRound.playerResults['3'].afterScore += extraScores[3]
            }

            alert(
              `對局結束。終局時剩餘的 ${updatedMatchRound.nextRoundCumulatedThousands * 1000} 供託已派給首位。`
            )
          } else {
            // TODO: Proceed to Game End
            alert('對局結束。')
          }
        }

        updateCurrentMatchRound({
          ...updatedMatchRound,
          nextRoundType: isGameEnded
            ? NextRoundTypeEnum.End
            : isGoNextRound
              ? NextRoundTypeEnum.NextRoundAndExtended
              : NextRoundTypeEnum.Extended,
        })
        toggleExhaustedDialog(false)

        setActiveAnimationMessage('分數變動中…')
        setTimeout(() => {
          setActiveAnimationMessage(null)
        }, 4000)
      } catch (e) {
        console.error(e)
      }
    },
    [toggleExhaustedDialog, updateCurrentMatchRound]
  )

  const handleSubmitMatchHotfixDialog = useCallback(
    (updatedMatchRound: RealtimeMatchRound) => {
      try {
        updateCurrentMatchRound({
          playerResults: updatedMatchRound.playerResults,
          resultType: RoundResultTypeEnum.Hotfix,
        })

        const newMatchRound: RealtimeMatchRound = {
          matchId,
          code: generateMatchRoundCode(
            matchId,
            updatedMatchRound.roundCount,
            updatedMatchRound.extendedRoundCount
          ),
          roundCount: updatedMatchRound.roundCount,
          extendedRoundCount: updatedMatchRound.extendedRoundCount,
          cumulatedThousands: updatedMatchRound.cumulatedThousands,
          nextRoundCumulatedThousands: 0,
          resultType: RoundResultTypeEnum.Unknown,
          nextRoundType: NextRoundTypeEnum.Unknown,
          playerResults: formatPlayerResultsByPreviousPlayerResults(
            updatedMatchRound.playerResults
          ),
          doras: rtMatchCurrentRound?.doras ?? [],
        }

        pushMatchRound(newMatchRound)

        setActiveAnimationMessage('分數變動中…')
        setTimeout(() => {
          setActiveAnimationMessage(null)
        }, 4000)

        toggleHotfixDialog(false)
      } catch (e) {
        console.error(e)
      }
    },
    [
      rtMatchCurrentRound?.doras,
      matchId,
      pushMatchRound,
      toggleHotfixDialog,
      updateCurrentMatchRound,
    ]
  )

  const handleClickGoNextRound = useCallback(() => {
    if (!rtMatchCurrentRound) {
      return
    }

    const newRoundCount =
      rtMatchCurrentRound.nextRoundType === NextRoundTypeEnum.NextRound ||
      rtMatchCurrentRound.nextRoundType ===
        NextRoundTypeEnum.NextRoundAndExtended
        ? rtMatchCurrentRound.roundCount + 1
        : rtMatchCurrentRound.roundCount

    const newExtendedRoundCount =
      rtMatchCurrentRound.nextRoundType === NextRoundTypeEnum.Extended ||
      rtMatchCurrentRound.nextRoundType ===
        NextRoundTypeEnum.NextRoundAndExtended
        ? rtMatchCurrentRound.extendedRoundCount + 1
        : 0

    const newMatchRound: RealtimeMatchRound = {
      matchId,
      code: generateMatchRoundCode(
        matchId,
        newRoundCount,
        newExtendedRoundCount
      ),
      roundCount: newRoundCount,
      extendedRoundCount: newExtendedRoundCount,
      cumulatedThousands: rtMatchCurrentRound.nextRoundCumulatedThousands,
      nextRoundCumulatedThousands: 0,
      resultType: RoundResultTypeEnum.Unknown,
      nextRoundType: NextRoundTypeEnum.Unknown,
      playerResults: formatPlayerResultsByPreviousPlayerResults(
        rtMatchCurrentRound.playerResults
      ),
      doras: {},
    }

    pushMatchRound(newMatchRound).then(() => {
      setClickedDoraIndex(-1)
    })
  }, [rtMatchCurrentRound, matchId, pushMatchRound])

  const handleClickStartOBS = useCallback(() => {
    setObsInfo({
      matchId,
    })
  }, [matchId, setObsInfo])

  const [activeWaitingTilesData, setActiveWaitingTilesData] = useState<{
    index: PlayerIndex
    tiles: string[]
  } | null>(null)

  const handleCloseWaitingTileDoraKeyboard = useCallback(() => {
    setActiveWaitingTilesData(null)
  }, [])

  const handleSubmitWaitingTileDoraKeyboard = useCallback(
    (newTiles: string[]) => {
      if (!activeWaitingTilesData) {
        return
      }

      updateCurrentMatchRound({
        playerResults: {
          ...(rtMatchCurrentRound?.playerResults as Record<
            PlayerIndex,
            PlayerResult
          >),
          [activeWaitingTilesData.index]: {
            ...rtMatchCurrentRound?.playerResults[activeWaitingTilesData.index],
            waitingTiles: newTiles,
          },
        },
      })
      setActiveWaitingTilesData(null)
    },
    [
      activeWaitingTilesData,
      rtMatchCurrentRound?.playerResults,
      updateCurrentMatchRound,
    ]
  )

  const handleRemoveWaitingTileDoraKeyboard = useCallback(() => {
    if (!activeWaitingTilesData) {
      return
    }

    updateCurrentMatchRound({
      playerResults: {
        ...(rtMatchCurrentRound?.playerResults as Record<
          PlayerIndex,
          PlayerResult
        >),
        [activeWaitingTilesData.index]: {
          ...rtMatchCurrentRound?.playerResults[activeWaitingTilesData.index],
          waitingTiles: [],
        },
      },
    })
    setActiveWaitingTilesData(null)
  }, [
    activeWaitingTilesData,
    rtMatchCurrentRound?.playerResults,
    updateCurrentMatchRound,
  ])

  const [activePredictYakusData, setActivePredictYakusData] = useState<{
    index: PlayerIndex
  } | null>(null)

  const handleClosePredictYakusDialog = useCallback(() => {
    setActivePredictYakusData(null)
  }, [])

  const handleSubmitPredictYakusDialog = useCallback(
    (newDetail: MJYakuKeyboardResult) => {
      if (!rtMatchCurrentRound || !activePredictYakusData) {
        return
      }

      updateCurrentMatchRound({
        playerResults: {
          ...rtMatchCurrentRound.playerResults,
          [activePredictYakusData.index]: {
            ...rtMatchCurrentRound.playerResults[activePredictYakusData.index],
            detail: {
              ...rtMatchCurrentRound.playerResults[activePredictYakusData.index]
                .detail,
              ...newDetail,
            },
          },
        },
      })

      setActivePredictYakusData(null)
    },
    [activePredictYakusData, rtMatchCurrentRound, updateCurrentMatchRound]
  )

  const handleClickEditMatchName = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()

      if (!rtMatch) {
        return
      }

      const newName = prompt('對局名稱', rtMatch.name)
      if (newName) {
        setMatchName(newName)
      }
    },
    [rtMatch, setMatchName]
  )

  const handleClickBroadcastRonDetail = useCallback(
    (e: React.MouseEvent) => {
      if (!rtMatchRounds) {
        return
      }

      const matchRoundId = e.currentTarget.getAttribute('data-rtMatch-round-id')
      if (!matchRoundId) {
        return
      }

      const newResultDetail = rtMatchRounds[matchRoundId].resultDetail
      if (!newResultDetail) {
        return
      }

      setMatchActiveResultDetail(newResultDetail)
      setMatchRoundHasBroadcastedToTrue(matchRoundId)
      setActiveAnimationMessage('播放和牌中…')

      setTimeout(() => {
        setMatchActiveResultDetail(null)
        setActiveAnimationMessage(null)
      }, 10000)
    },
    [
      rtMatchRounds,
      setMatchActiveResultDetail,
      setMatchRoundHasBroadcastedToTrue,
    ]
  )

  const handleClickClearActiveResult = useCallback(() => {
    setMatchActiveResultDetail(null)
  }, [setMatchActiveResultDetail])

  const handleClickDisplayPoint = useCallback(() => {
    setMatchPointDisplay(true)
  }, [setMatchPointDisplay])

  const handleClickDisplayScore = useCallback(() => {
    setMatchPointDisplay(false)
  }, [setMatchPointDisplay])

  const handleClickHideHeader = useCallback(() => {
    setMatchHideHeaderDisplay(true)
  }, [setMatchHideHeaderDisplay])

  const handleClickShowHeader = useCallback(() => {
    setMatchHideHeaderDisplay(false)
  }, [setMatchHideHeaderDisplay])

  const handleClickHidePlayers = useCallback(() => {
    setMatchHidePlayersDisplay(true)
  }, [setMatchHidePlayersDisplay])

  const handleClickShowPlayers = useCallback(() => {
    setMatchHidePlayersDisplay(false)
  }, [setMatchHidePlayersDisplay])

  if (!rtMatch || !rtMatchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-24 pb-48">
        <div className="space-y-6">
          <div className="flex flex-row items-center gap-x-4 text-white">
            <div
              className="p-2 pl-4 pr-10 flex items-center gap-x-8 transition-[width] text-[4rem]"
              style={{
                background: `linear-gradient(280deg, transparent, transparent 22px, #00000080 23px, #00000080 100%)`,
              }}
            >
              <div className="text-[0.5em] relative">
                <div className="text-[0.5em]">
                  <button type="button" onClick={handleClickEditMatchName}>
                    {rtMatch.name} <i className="bi bi-pencil"></i>
                  </button>
                </div>
                <div className="flex gap-x-8 items-center">
                  <div>
                    <MJMatchCounterSpan
                      roundCount={rtMatchCurrentRound.roundCount}
                      max={8}
                    />
                  </div>

                  <div className="flex flex-col justify-around">
                    <div className="flex-1 flex flex-row items-center gap-x-3">
                      <div className="flex-1">
                        <img
                          src="/images/score-hundred.png"
                          alt="hundred"
                          className="h-2"
                        />
                      </div>
                      <div className="text-[0.4em] pb-1.5 leading-none">
                        {rtMatchCurrentRound.extendedRoundCount ?? 0}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-row items-center gap-x-3">
                      <div className="flex-1">
                        <img
                          src="/images/score-thousand.png"
                          alt="thousand"
                          className="h-2"
                        />
                      </div>
                      <div className="text-[0.4em] pb-1.5 leading-none">
                        {rtMatchCurrentRound.cumulatedThousands ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
                {rtMatch.hideHeader && (
                  <div className="absolute inset-0 opacity-100 bg-red-800 text-center">
                    隱藏中
                  </div>
                )}
              </div>

              <div className="flex items-center gap-x-2">
                {rtMatchCurrentRoundDoras.map((dora, index) => (
                  <button
                    data-index={index}
                    onClick={handleClickDora}
                    className="hover:opacity-80"
                  >
                    <MJTileDiv
                      key={dora}
                      className="w-12! animate-[fadeInFromLeft_0.5s_ease-in-out]"
                    >
                      {dora}
                    </MJTileDiv>
                  </button>
                ))}

                <MJUIButton
                  type="button"
                  color={
                    rtMatchCurrentRoundDoras.length === 0
                      ? 'danger'
                      : 'secondary'
                  }
                  className={`${
                    rtMatchCurrentRoundDoras.length === 0 && 'animate-bounce'
                  }`}
                  data-index="-1"
                  onClick={handleClickDora}
                >
                  +懸賞
                </MJUIButton>
              </div>
            </div>

            <div className="flex-1" />

            <div className="shrink-0">
              {obsInfo?.matchId !== matchId && (
                <MJUIButton
                  color="success"
                  type="button"
                  className="animate-pulse"
                  onClick={handleClickStartOBS}
                >
                  開始OBS
                </MJUIButton>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-x-8 ">
            <div className="text-right space-x-4">
              {rtMatch.activeResultDetail && (
                <MJUIButton
                  color="secondary"
                  type="button"
                  onClick={handleClickClearActiveResult}
                >
                  結束播放中的和牌詳情
                  <br />
                  <span className="text-xs">(或最多10秒後自動結束)</span>
                </MJUIButton>
              )}
              {rtMatchCurrentRound.nextRoundType !==
                NextRoundTypeEnum.Unknown &&
                rtMatchCurrentRound.nextRoundType !== NextRoundTypeEnum.End && (
                  <MJUIButton
                    color="success"
                    type="button"
                    className="animate-pulse"
                    onClick={handleClickGoNextRound}
                  >
                    進入
                    <MJMatchCounterSpan
                      roundCount={
                        rtMatchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.NextRound ||
                        rtMatchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.NextRoundAndExtended
                          ? rtMatchCurrentRound.roundCount + 1
                          : rtMatchCurrentRound.roundCount
                      }
                      extendedRoundCount={
                        rtMatchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.Extended ||
                        rtMatchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.NextRoundAndExtended
                          ? rtMatchCurrentRound.extendedRoundCount + 1
                          : 0
                      }
                    />
                  </MJUIButton>
                )}

              <MJUIButton
                color="secondary"
                type="button"
                onClick={handleClickExhausted}
              >
                流局
              </MJUIButton>
            </div>
          </div>

          <PlayersListView
            players={rtMatch.players}
            currentRound={rtMatchCurrentRound}
            onAction={handlePlayerListViewAction}
          />

          <div>
            <MJUIButton
              size="small"
              color="secondary"
              onClick={handleClickEditPlayers}
            >
              <i className="bi bi-people"></i> 修改玩家
            </MJUIButton>
          </div>
        </div>

        {/* <div className="space-y-6">
          <h4 className="text-3xl">
            <i className="bi bi-clock-history"></i> 和牌記錄
          </h4>

          <table className="data-table w-full">
            <thead>
              <tr>
                <th>局數</th>
                <th>玩家</th>
                <th>分數＆細節</th>
                <th className="text-right px-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {matchRoundsWithDetail.map((rtMatchRound) => (
                <tr className="odd:bg-neutral-200" key={rtMatchRound.id}>
                  <td className="text-center py-1">
                    <MJMatchCounterSpan
                      roundCount={rtMatchRound.roundCount}
                      extendedRoundCount={rtMatchRound.extendedRoundCount}
                    />
                  </td>
                  <td
                    className="text-center py-1"
                    style={{
                      background:
                        rtMatch.players[
                          rtMatchRound.resultDetail!.winnerPlayerIndex
                        ].color,
                    }}
                  >
                    {
                      rtMatch.players[rtMatchRound.resultDetail!.winnerPlayerIndex]
                        .primaryName
                    }
                  </td>
                  <td className="text-center py-1">
                    <p>
                      {rtMatchRound
                        .resultDetail!.yakus.map(({ label }) => label)
                        .join(' ')}
                    </p>
                    <p>
                      <MJHanFuTextSpan
                        han={rtMatchRound.resultDetail!.han}
                        fu={rtMatchRound.resultDetail!.fu}
                        yakumanCount={rtMatchRound.resultDetail!.yakumanCount}
                        yakumanCountMax={convertYakumanMaxToCountMax(
                          rtMatch.setting.yakumanMax
                        )}
                        isManganRoundUp={rtMatch.setting.isManganRoundUp === '1'}
                      />
                    </p>
                  </td>
                  <td className="text-right py-1 px-2">
                    <MJUIButton
                      color={rtMatchRound.hasBroadcasted ? 'secondary' : 'danger'}
                      type="button"
                      className={rtMatchRound.hasBroadcasted ? 'opacity-50' : ''}
                      onClick={handleClickBroadcastRonDetail}
                      data-rtMatch-round-id={rtMatchRound.id}
                    >
                      <i className="bi bi-camera-reels"></i>{' '}
                      {rtMatchRound.hasBroadcasted ? '再次播放' : '播放和牌詳情'}
                    </MJUIButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        <div className="space-y-6">
          <h4 className="text-3xl">
            <i className="bi bi-bar-chart-steps"></i> 紀錄{' '}
            <span className="text-sm">
              ( 立=立直, 和=和牌, 統=出統, 摸=自摸, 聽=聽牌 )
            </span>
          </h4>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-400 [&>th]:p-2">
                <th className="whitespace-nowrap px-16">局數</th>
                <th>{rtMatch.players['0'].nickname}</th>
                <th>{rtMatch.players['1'].nickname}</th>
                <th>{rtMatch.players['2'].nickname}</th>
                <th>{rtMatch.players['3'].nickname}</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {matchRoundsWithDetail[0] && (
                <tr className="even:bg-gray-200 [&>td]:p-2">
                  <td className="text-center" />
                  <td className="text-center">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[0].playerResults['0'].beforeScore
                      }
                    />
                  </td>
                  <td className="text-center">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[0].playerResults['1'].beforeScore
                      }
                    />
                  </td>
                  <td className="text-center">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[0].playerResults['2'].beforeScore
                      }
                    />
                  </td>
                  <td className="text-center">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[0].playerResults['3'].beforeScore
                      }
                    />
                  </td>
                  <td></td>
                </tr>
              )}
              {matchRoundsWithDetail.map((rtMatchRound) => {
                if (rtMatchRound.resultType === RoundResultTypeEnum.Hotfix) {
                  return (
                    <tr
                      key={rtMatchRound.id}
                      className="even:bg-gray-200 [&>td]:p-2"
                    >
                      <td className="text-center whitespace-nowrap px-16">
                        手動調整
                      </td>
                      <td className="text-center">
                        {rtMatchRound.playerResults['0'].afterScore}
                      </td>
                      <td className="text-center">
                        {rtMatchRound.playerResults['1'].afterScore}
                      </td>
                      <td className="text-center">
                        {rtMatchRound.playerResults['2'].afterScore}
                      </td>
                      <td className="text-center">
                        {rtMatchRound.playerResults['3'].afterScore}
                      </td>
                      <td></td>
                    </tr>
                  )
                }

                return (
                  <tr
                    key={rtMatchRound.id}
                    className="even:bg-gray-200 [&>td]:p-2"
                  >
                    <td className="text-center whitespace-nowrap">
                      <MJMatchCounterSpan
                        roundCount={rtMatchRound.roundCount}
                        extendedRoundCount={rtMatchRound.extendedRoundCount}
                        max={8}
                        className="px-4"
                      />
                    </td>
                    <td className="text-center">
                      <MJMatchHistoryAmountSpan
                        value={
                          rtMatchRound.playerResults['0'].afterScore -
                          rtMatchRound.playerResults['0'].beforeScore
                        }
                      />
                      <PlayerResultMetadata
                        rtMatch={rtMatch}
                        rtMatchRound={rtMatchRound}
                        playerIndex="0"
                      />
                    </td>
                    <td className="text-center">
                      <MJMatchHistoryAmountSpan
                        value={
                          rtMatchRound.playerResults['1'].afterScore -
                          rtMatchRound.playerResults['1'].beforeScore
                        }
                      />
                      <PlayerResultMetadata
                        rtMatch={rtMatch}
                        rtMatchRound={rtMatchRound}
                        playerIndex="1"
                      />
                    </td>
                    <td className="text-center">
                      <MJMatchHistoryAmountSpan
                        value={
                          rtMatchRound.playerResults['2'].afterScore -
                          rtMatchRound.playerResults['2'].beforeScore
                        }
                      />
                      <PlayerResultMetadata
                        rtMatch={rtMatch}
                        rtMatchRound={rtMatchRound}
                        playerIndex="2"
                      />
                    </td>
                    <td className="text-center">
                      <MJMatchHistoryAmountSpan
                        value={
                          rtMatchRound.playerResults['3'].afterScore -
                          rtMatchRound.playerResults['3'].beforeScore
                        }
                      />
                      <PlayerResultMetadata
                        rtMatch={rtMatch}
                        rtMatchRound={rtMatchRound}
                        playerIndex="3"
                      />
                    </td>
                    <td className="text-right space-x-2">
                      {(rtMatchRound.resultType === RoundResultTypeEnum.Ron ||
                        rtMatchRound.resultType ===
                          RoundResultTypeEnum.SelfDrawn) && (
                        <MJUIButton
                          color={
                            rtMatchRound.hasBroadcasted
                              ? 'secondary'
                              : 'success'
                          }
                          type="button"
                          variant="text"
                          className={
                            rtMatchRound.hasBroadcasted ? 'opacity-50' : ''
                          }
                          onClick={handleClickBroadcastRonDetail}
                          data-rtMatch-round-id={rtMatchRound.id}
                        >
                          <i className="bi bi-camera-reels"></i>{' '}
                          {rtMatchRound.hasBroadcasted
                            ? '已播放過'
                            : '播放和牌詳情'}
                        </MJUIButton>
                      )}

                      {rtMatchRound.resultType !==
                        RoundResultTypeEnum.Unknown && (
                        <MJUIButton
                          variant="text"
                          color="danger"
                          data-matchRoundId={rtMatchRound.id}
                          onClick={handleClickEditMatchRound}
                        >
                          <i className="bi bi-pencil"></i> 修改
                        </MJUIButton>
                      )}
                    </td>
                  </tr>
                )
              })}
              {matchRoundsWithDetail[matchRoundsWithDetail.length - 1] && (
                <tr className="even:bg-gray-200 [&>td]:p-2">
                  <td className="text-center whitespace-nowrap px-16">
                    <MJUIButton
                      onClick={handleClickHotfix}
                      size="small"
                      color="secondary"
                    >
                      <i className="bi bi-pencil"></i> 手動調整分數
                    </MJUIButton>
                  </td>
                  <td className="text-center font-bold text-lg">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[matchRoundsWithDetail.length - 1]
                          .playerResults['0'].afterScore
                      }
                    />
                  </td>
                  <td className="text-center font-bold text-lg">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[matchRoundsWithDetail.length - 1]
                          .playerResults['1'].afterScore
                      }
                    />
                  </td>
                  <td className="text-center font-bold text-lg">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[matchRoundsWithDetail.length - 1]
                          .playerResults['2'].afterScore
                      }
                    />
                  </td>
                  <td className="text-center font-bold text-lg">
                    <MJAmountSpan
                      value={
                        matchRoundsWithDetail[matchRoundsWithDetail.length - 1]
                          .playerResults['3'].afterScore
                      }
                    />
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>

          {/* <div>
            <MJUIButton
              color="secondary"
              type="button"
              onClick={handleClickHotfix}
            >
              手動調整分數
            </MJUIButton>
          </div> */}
        </div>
      </div>

      <MJUIDialogV2
        open={typeof clickedDoraIndex !== 'undefined'}
        title="選擇懸賞"
        onClose={handleCloseDoraKeyboard}
      >
        <MJTileKeyboardDiv
          hideRedTiles
          onSubmit={handleSubmitDoraKeyboard}
          onRemove={handleRemoveDoraKeyboard}
          canRemove={
            typeof clickedDoraIndex !== 'undefined' && clickedDoraIndex > 0
          }
          defaultValue={
            typeof clickedDoraIndex !== 'undefined'
              ? [rtMatchCurrentRoundDoras[clickedDoraIndex]]
              : undefined
          }
        />
      </MJUIDialogV2>

      <MJUIDialogV2
        open={!!activeWaitingTilesData}
        title="選擇待牌"
        onClose={handleCloseWaitingTileDoraKeyboard}
      >
        <MJTileKeyboardDiv
          hideRedTiles
          onSubmit={handleSubmitWaitingTileDoraKeyboard}
          onRemove={handleRemoveWaitingTileDoraKeyboard}
          defaultValue={activeWaitingTilesData?.tiles}
          multiple
          canRemove
        />
      </MJUIDialogV2>

      <MJYakuKeyboardDialog
        round={rtMatchCurrentRound.roundCount}
        activePlayerIndex={activePredictYakusData?.index ?? '0'}
        targetPlayerIndex={'-1'}
        open={!!activePredictYakusData}
        onClose={handleClosePredictYakusDialog}
        onSubmit={handleSubmitPredictYakusDialog}
        defaultValue={
          rtMatchCurrentRound.playerResults[
            activePredictYakusData?.index ?? '0'
          ].detail
        }
      />

      <MJUIDialogV2
        title="和了"
        open={isShowingRonDialog}
        onClose={() => toggleRonDialog(false)}
      >
        <MJMatchRonForm
          rtMatch={rtMatch}
          currentMatchRound={rtMatchCurrentRound}
          onSubmit={handleSubmitMatchRonDialog}
          {...ronDialogProps}
        />
      </MJUIDialogV2>

      <MJUIDialogV2
        title="流局"
        open={isShowingExhaustedDialog}
        onClose={() => toggleExhaustedDialog(false)}
      >
        <MJMatchExhaustedForm
          rtMatch={rtMatch}
          currentMatchRound={rtMatchCurrentRound}
          onSubmit={handleSubmitMatchExhaustedDialog}
          {...ronDialogProps}
        />
      </MJUIDialogV2>

      <MJUIDialogV2
        title="修改玩家"
        open={isShowingEditPlayersDialog}
        onClose={() => toggleEditPlayersDialog(false)}
      >
        <MJPlayersForm
          defaultPlayers={rtMatch.players}
          onSubmit={handleSubmitPlayersForm}
        />
      </MJUIDialogV2>

      <MJUIDialogV2
        title="手動調整分數"
        open={isShowingHotfixDialog}
        onClose={() => toggleHotfixDialog(false)}
      >
        <MJMatchHotfixForm
          rtMatch={rtMatch}
          currentMatchRound={rtMatchCurrentRound}
          onSubmit={handleSubmitMatchHotfixDialog}
          {...ronDialogProps}
        />
      </MJUIDialogV2>

      <MJUIDialogV2
        title="修改局數"
        open={isShowingEditDialog}
        onClose={() => toggleEditDialog(false)}
      >
        <MJMatchRoundEditForm
          rtMatch={rtMatch}
          rtMatchRound={editDialogProps.rtMatchRound}
          onSubmit={handleSubmitRoundEdit}
        />
      </MJUIDialogV2>

      {/* 
      {unboardcastedMatchRounds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-4">
          <div className="bg-red-300 border-red-600 rounded-lg shadow-lg border-2 p-4">
            <h4 className="text-xl font-bold">
              <i className="bi bi-camera-reels"></i> 你有未播放的動畫！
            </h4>

            <table className="data-table mt-4 w-full bg-white">
              <thead>
                <tr>
                  <th>局數</th>
                  <th>玩家</th>
                  <th>分數＆細節</th>
                  <th className="text-right px-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {unboardcastedMatchRounds.map((rtMatchRound) => (
                  <tr className="odd:bg-neutral-200" key={rtMatchRound.id}>
                    <td className="text-center py-1">
                      <MJMatchCounterSpan
                        roundCount={rtMatchRound.roundCount}
                        extendedRoundCount={rtMatchRound.extendedRoundCount}
                      />
                    </td>
                    <td
                      className="text-center py-1"
                      style={{
                        background:
                          rtMatch.players[
                            rtMatchRound.resultDetail!.winnerPlayerIndex
                          ].color,
                      }}
                    >
                      {
                        rtMatch.players[
                          rtMatchRound.resultDetail!.winnerPlayerIndex
                        ].primaryName
                      }
                    </td>
                    <td className="text-center py-1">
                      <p>
                        {rtMatchRound
                          .resultDetail!.yakus.map(({ label }) => label)
                          .join(' ')}
                      </p>
                      <p>
                        <MJHanFuTextSpan
                          han={rtMatchRound.resultDetail!.han}
                          fu={rtMatchRound.resultDetail!.fu}
                          yakumanCount={rtMatchRound.resultDetail!.yakumanCount}
                          isManganRoundUp={
                            rtMatch.setting.isManganRoundUp === '1'
                          }
                        />
                      </p>
                    </td>
                    <td className="text-right py-1 px-2">
                      <MJUIButton
                        color={
                          rtMatchRound.hasBroadcasted ? 'secondary' : 'success'
                        }
                        type="button"
                        className={
                          rtMatchRound.hasBroadcasted
                            ? 'opacity-50'
                            : 'animate-pulse'
                        }
                        onClick={handleClickBroadcastRonDetail}
                        data-rtMatch-round-id={rtMatchRound.id}
                      >
                        {rtMatchRound.hasBroadcasted
                          ? '已播放過'
                          : '播放和牌詳情'}
                      </MJUIButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}

      <div className="fixed bottom-0 left-0 right-0 pl-6 pr-6 pb-6 z-50 flex justify-between items-end bg-linear-to-b from-transparent to-[#00000080]">
        <div className="text-left"></div>

        <div>
          <div className="text-right mb-4">
            {rtMatchCurrentRound.nextRoundType !== NextRoundTypeEnum.Unknown &&
              rtMatchCurrentRound.nextRoundType !== NextRoundTypeEnum.End && (
                <button
                  className="text-6xl p-4 text-green-800 bg-green-400 border-4 border-green-600 rounded-lg"
                  onClick={handleClickGoNextRound}
                >
                  進入
                  <MJMatchCounterSpan
                    roundCount={
                      rtMatchCurrentRound.nextRoundType ===
                        NextRoundTypeEnum.NextRound ||
                      rtMatchCurrentRound.nextRoundType ===
                        NextRoundTypeEnum.NextRoundAndExtended
                        ? rtMatchCurrentRound.roundCount + 1
                        : rtMatchCurrentRound.roundCount
                    }
                    extendedRoundCount={
                      rtMatchCurrentRound.nextRoundType ===
                        NextRoundTypeEnum.Extended ||
                      rtMatchCurrentRound.nextRoundType ===
                        NextRoundTypeEnum.NextRoundAndExtended
                        ? rtMatchCurrentRound.extendedRoundCount + 1
                        : 0
                    }
                  />{' '}
                  <i className="bi bi-play-fill"></i>
                </button>
              )}

            {rtMatchCurrentRound.nextRoundType === NextRoundTypeEnum.End && (
              <a href={`/v1/match/${matchId}/export`} target="_blank">
                <button className="text-6xl p-4 text-yellow-800 bg-yellow-400 border-4 border-yellow-600 rounded-lg">
                  上傳成績
                  <i className="bi bi-cloud-upload"></i>
                </button>
              </a>
            )}
          </div>
          <div className="flex gap-x-6 items-end justify-end">
            {!rtMatch.hideHeader && (
              <button
                onClick={handleClickHideHeader}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 leading-6 text-neutral-600"
              >
                <i className="bi bi-eye"></i> 標題：顯示中
              </button>
            )}
            {rtMatch.hideHeader && (
              <button
                onClick={handleClickShowHeader}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-red-600 border border-red-500 leading-6 text-white"
              >
                <i className="bi bi-eye-slash"></i> 標題：隱藏中
              </button>
            )}
            {!rtMatch.hidePlayers && (
              <button
                onClick={handleClickHidePlayers}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 leading-6 text-neutral-600"
              >
                <i className="bi bi-people-fill"></i> 玩家：顯示中
              </button>
            )}
            {rtMatch.hidePlayers && (
              <button
                onClick={handleClickShowPlayers}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-red-600 border border-red-500 leading-6 text-white"
              >
                <i className="bi bi-people"></i> 玩家：隱藏中
              </button>
            )}
            {!rtMatch.showPoints && (
              <button
                onClick={handleClickDisplayPoint}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 leading-6 text-neutral-600"
              >
                <i className="bi bi-list-ol"></i> 切換播放馬點＆名次
              </button>
            )}
            {rtMatch.showPoints && (
              <button
                onClick={handleClickDisplayScore}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-green-300 border border-green-300 leading-6 text-green-800"
              >
                <i className="bi bi-list-ol"></i> 切換播放馬點＆名次
              </button>
            )}

            {unboardcastedMatchRounds.map((rtMatchRound) => (
              <button
                onClick={handleClickBroadcastRonDetail}
                data-rtMatch-round-id={rtMatchRound.id}
                className="relative rounded-full py-2 px-4 shadow-sm shadow-neutral-700 text-center bg-red-200 border border-red-300 leading-6 text-red-800 animate-bounce"
              >
                <p>
                  <i className="bi bi-trophy"></i> {rtMatchRound.roundCount}.
                  {rtMatchRound.extendedRoundCount} 和牌動畫：待播放
                </p>
              </button>
            ))}

            {/* <button className="relative rounded-full p-5 shadow-sm shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 text-4xl leading-6 text-neutral-600">
            {activeAnimationMessage ? (
              <span>
                <i className="bi bi-hourglass-split"></i>{' '}
                {activeAnimationMessage}
              </span>
            ) : (
              <i className="bi bi-camera-reels"></i>
            )}

            {unboardcastedMatchRounds.length > 0 && (
              <div className="absolute h-6 w-6 -top-1 -left-1 shadow-sm shadow-neutral-700 bg-red-600 text-white text-sm rounded-full font-semibold">
                {unboardcastedMatchRounds.length}
              </div>
            )}
          </button> */}
          </div>
        </div>
      </div>

      <div className="text-right text-base-300">{rtMatch.code}</div>
    </div>
  )
}
