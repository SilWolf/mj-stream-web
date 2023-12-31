/* eslint-disable no-nested-ternary */
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import useMatch from '@/hooks/useMatch'
import {
  MatchRound,
  NextRoundTypeEnum,
  PlayerIndex,
  PlayerResult,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import { useConfirmDialog } from '@/components/ConfirmDialog/provider'
import MJMatchRonDialog, {
  MJMatchRonProps,
} from '@/components/MJMatchRonDialog'
import {
  formatPlayerResultsByPreviousPlayerResults,
  generateMatchRoundCode,
  getAfterOfPlayerIndex,
  getBeforeOfPlayerIndex,
  getIsPlayerEast,
  getOppositeOfPlayerIndex,
  getPlayerIndexOfEastByRound,
} from '@/helpers/mahjong.helper'
import { useBoolean } from 'react-use'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJTileDiv, { MJTileKey } from '@/components/MJTileDiv'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileKeyboardDiv from '@/components/MJTileKeyboardDiv'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import MJMatchExhaustedDialog from '@/components/MJMatchExhaustedDialog'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJMatchHotfixDialog from '@/components/MJMatchHotifxDialog'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MJHanFuTextSpan from '@/components/MJHanFuTextSpan'
import { useQuery } from '@tanstack/react-query'
import { apiGetMatchById } from '@/helpers/sanity.helper'
import ControlNewMatch from '../ControlNewMatch'
import PlayersListView from './components/PlayersView/PlayersListView'
import PlayersGridView from './components/PlayersView/PlayersGridView'
import MJUITabs from '@/components/MJUI/MJUITabs'
import { PlayersViewAction } from './components/PlayersView'
import {
  MJYakuKeyboardDialog,
  MJYakuKeyboardResult,
} from '@/components/MJYakuKeyboardDiv'

const VIEW_TABS = [
  {
    label: (
      <span>
        <i className="bi bi-hdd-stack-fill"></i> 列表(舊版)
      </span>
    ),
    value: 'listView-old',
  },
  {
    label: (
      <span>
        <i className="bi bi-hdd-stack-fill"></i> 列表(新版)
      </span>
    ),
    value: 'listView-new',
  },
  {
    label: (
      <span>
        <i className="bi-grid-fill"></i> 2x2
      </span>
    ),
    value: 'gridView',
  },
]

type Props = {
  params: { matchId: string }
}

export default function MatchControlPage({ params: { matchId } }: Props) {
  const { data: obsInfo, set: setObsInfo } =
    useFirebaseDatabaseByKey<string>('obs/1')

  const { data: dbMatch } = useQuery({
    queryKey: ['matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchById(queryKey[1]),
  })

  const {
    match,
    matchRounds,
    matchCurrentRound,
    matchCurrentRoundDoras,
    updateCurrentMatchRound,
    pushMatchRound,
    setCurrentRoundDoras,
    setMatchName,
    setMatchPointDisplay,
    setMatchActiveResultDetail,
    setMatchRoundHasBroadcastedToTrue,
  } = useMatch(matchId)

  const matchRoundsWithDetail = useMemo(
    () =>
      Object.entries(matchRounds ?? {})
        .filter(([, matchRound]) => !!matchRound.resultDetail)
        .map(([matchRoundId, matchRound]) => ({
          id: matchRoundId,
          ...matchRound,
        }))
        .reverse() ?? [],
    [matchRounds]
  )

  const unboardcastedMatchRounds = useMemo(
    () => matchRoundsWithDetail.filter(({ hasBroadcasted }) => !hasBroadcasted),
    [matchRoundsWithDetail]
  )

  const [clickedDoraIndex, setClickedDoraIndex] = useState<number | undefined>(
    undefined
  )

  const [viewTabValue, setViewTabValue] = useState<string>(VIEW_TABS[0].value)

  const [isShowingRonDialog, toggleRonDialog] = useBoolean(false)
  const [ronDialogProps, setRonDialogProps] = useState<
    Pick<
      MJMatchRonProps,
      'initialActivePlayerIndex' | 'initialTargetPlayerIndex'
    >
  >({ initialActivePlayerIndex: '0', initialTargetPlayerIndex: '-1' })
  const confirmDialog = useConfirmDialog()

  const [isShowingExhaustedDialog, toggleExhaustedDialog] = useBoolean(false)
  const [isShowingHotfixDialog, toggleHotfixDialog] = useBoolean(false)

  const [activeAnimationMessage, setActiveAnimationMessage] = useState<
    string | null
  >(null)

  const handleClickRiichi = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const playerIndex = e.currentTarget.getAttribute(
        'data-player-index'
      ) as unknown as PlayerIndex
      if (!playerIndex) {
        return
      }

      const player = match?.players[playerIndex]
      if (!player) {
        return
      }

      const isDoingRiichi =
        !matchCurrentRound?.playerResults[playerIndex].isRiichi

      confirmDialog.showConfirmDialog({
        title: isDoingRiichi ? '確定要立直嗎？' : '取消立直？',
        content: isDoingRiichi
          ? `一旦點擊確定，就會播出立直動畫，請確定立直的是 ${player.name}！`
          : `你是否想取消 ${player.name} 的立直？`,
        onClickOk: async () => {
          updateCurrentMatchRound({
            playerResults: {
              ...(matchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...matchCurrentRound?.playerResults[playerIndex],
                isRiichi:
                  !matchCurrentRound?.playerResults[playerIndex].isRiichi,
              },
            },
          })
        },
      })
    },
    [
      confirmDialog,
      match?.players,
      matchCurrentRound?.playerResults,
      updateCurrentMatchRound,
    ]
  )

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

        const newDoras = [...matchCurrentRoundDoras]

        if (clickedDoraIndex === -1) {
          newDoras.push(tileKey)
        } else {
          newDoras[clickedDoraIndex] = tileKey
        }

        setCurrentRoundDoras(newDoras)
        setClickedDoraIndex(undefined)
      }
    },
    [clickedDoraIndex, matchCurrentRoundDoras, setCurrentRoundDoras]
  )

  const handleRemoveDoraKeyboard = useCallback(() => {
    if (typeof clickedDoraIndex !== 'undefined') {
      const newDoras = [...matchCurrentRoundDoras]

      if (clickedDoraIndex > -1) {
        newDoras.splice(clickedDoraIndex, 1)
        setCurrentRoundDoras(newDoras)
        setClickedDoraIndex(undefined)
      }
    }
  }, [clickedDoraIndex, matchCurrentRoundDoras, setCurrentRoundDoras])

  const handleCloseDoraKeyboard = useCallback(() => {
    setClickedDoraIndex(undefined)
  }, [])

  const handleClickRon = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const playerIndex = e?.currentTarget.getAttribute(
        'data-player-index'
      ) as PlayerIndex

      if (!playerIndex) {
        return
      }

      setRonDialogProps({
        initialActivePlayerIndex: playerIndex,
      })
      toggleRonDialog()
    },
    [toggleRonDialog]
  )

  const handleClickExhausted = useCallback(() => {
    toggleExhaustedDialog(true)
  }, [toggleExhaustedDialog])

  const handleClickHotfix = useCallback(() => {
    toggleHotfixDialog(true)
  }, [toggleHotfixDialog])

  const handlePlayerListViewAction = useCallback(
    (playerIndex: PlayerIndex, action: PlayersViewAction) => {
      console.log(playerIndex, action)
      if (!match || !matchCurrentRound) {
        return
      }

      const player = match.players[playerIndex]
      const playerResult = matchCurrentRound.playerResults[playerIndex]

      switch (action) {
        case 'reveal':
          return updateCurrentMatchRound({
            playerResults: {
              ...matchCurrentRound.playerResults,
              [playerIndex]: {
                ...matchCurrentRound.playerResults[playerIndex],
                isRevealed:
                  !matchCurrentRound.playerResults[playerIndex].isRevealed,
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  isRevealed:
                    !matchCurrentRound.playerResults[playerIndex].isRevealed,
                },
              },
            },
          })

        case 'riichi':
          return confirmDialog.showConfirmDialog({
            title: !playerResult.isRiichi ? '確定要立直嗎？' : '取消立直？',
            content: !playerResult.isRiichi
              ? `一旦點擊確定，就會播出立直動畫，請確定立直的是 ${player.name}！`
              : `你是否想取消 ${player.name} 的立直？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(matchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...matchCurrentRound?.playerResults[playerIndex],
                    isRiichi:
                      !matchCurrentRound?.playerResults[playerIndex].isRiichi,
                    detail: {
                      ...matchCurrentRound.playerResults[playerIndex].detail,
                      isRiichied:
                        !matchCurrentRound.playerResults[playerIndex].isRiichi,
                      raw: {
                        ...matchCurrentRound.playerResults[playerIndex].detail
                          .raw,
                        riichi:
                          !matchCurrentRound.playerResults[playerIndex]
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
              ...(matchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...matchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...matchCurrentRound.playerResults[playerIndex].detail.raw,
                    'menzenchin-tsumohou':
                      !matchCurrentRound?.playerResults[playerIndex].detail
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
              ...(matchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...matchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...matchCurrentRound.playerResults[playerIndex].detail.raw,
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
              ...(matchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...matchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...matchCurrentRound.playerResults[playerIndex].detail.raw,
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
              ...(matchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...matchCurrentRound?.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  raw: {
                    ...matchCurrentRound.playerResults[playerIndex].detail.raw,
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
              ...matchCurrentRound.playerResults,
              [playerIndex]: {
                ...matchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  dora:
                    matchCurrentRound.playerResults[playerIndex].detail.dora +
                    1,
                },
              },
            },
          })

        case 'dora-normal-minus':
          return updateCurrentMatchRound({
            playerResults: {
              ...matchCurrentRound.playerResults,
              [playerIndex]: {
                ...matchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  dora: Math.max(
                    matchCurrentRound.playerResults[playerIndex].detail.dora -
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
              ...matchCurrentRound.playerResults,
              [playerIndex]: {
                ...matchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  redDora:
                    matchCurrentRound.playerResults[playerIndex].detail
                      .redDora + 1,
                },
              },
            },
          })

        case 'dora-red-minus':
          return updateCurrentMatchRound({
            playerResults: {
              ...matchCurrentRound.playerResults,
              [playerIndex]: {
                ...matchCurrentRound.playerResults[playerIndex],
                detail: {
                  ...matchCurrentRound.playerResults[playerIndex].detail,
                  redDora: Math.max(
                    matchCurrentRound.playerResults[playerIndex].detail
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
              matchCurrentRound?.playerResults[playerIndex].waitingTiles ?? [],
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
              ? `一旦點擊確定，就會播出黃牌動畫，請確定要黃牌的是 ${player.name}！`
              : `你是否想取消 ${player.name} 的黃牌？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(matchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...matchCurrentRound?.playerResults[playerIndex],
                    isYellowCarded:
                      !matchCurrentRound?.playerResults[playerIndex]
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
              ? `一旦點擊確定，就會播出紅牌動畫，請確定要紅牌的是 ${player.name}！`
              : `你是否想取消 ${player.name} 的紅牌？`,
            onClickOk: async () => {
              updateCurrentMatchRound({
                playerResults: {
                  ...(matchCurrentRound?.playerResults as Record<
                    PlayerIndex,
                    PlayerResult
                  >),
                  [playerIndex]: {
                    ...matchCurrentRound?.playerResults[playerIndex],
                    isRedCarded:
                      !matchCurrentRound?.playerResults[playerIndex]
                        .isRedCarded,
                  },
                },
              })
            },
          })
      }
    },
    [
      confirmDialog,
      match,
      matchCurrentRound,
      toggleRonDialog,
      updateCurrentMatchRound,
    ]
  )

  const handleSubmitMatchRonDialog = useCallback(
    (updatedMatchRound: MatchRound) => {
      try {
        // Check if match is over
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
    (updatedMatchRound: MatchRound) => {
      try {
        const eastPlayerIndex = getPlayerIndexOfEastByRound(
          updatedMatchRound.roundCount
        )
        const isGoNextRound =
          updatedMatchRound.playerResults[eastPlayerIndex].type !==
          PlayerResultWinnerOrLoserEnum.Win
        const isGameEnded = isGoNextRound && updatedMatchRound.roundCount >= 8

        if (isGameEnded) {
          // TODO: Proceed to Game End
          alert('對局結束。')
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
    (updatedMatchRound: MatchRound) => {
      try {
        updateCurrentMatchRound({
          playerResults: updatedMatchRound.playerResults,
          resultType: RoundResultTypeEnum.Hotfix,
        })

        const newMatchRound: MatchRound = {
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
          doras: matchCurrentRound?.doras ?? [],
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
      matchCurrentRound?.doras,
      matchId,
      pushMatchRound,
      toggleHotfixDialog,
      updateCurrentMatchRound,
    ]
  )

  const handleClickGoNextRound = useCallback(() => {
    if (!matchCurrentRound) {
      return
    }

    const newRoundCount =
      matchCurrentRound.nextRoundType === NextRoundTypeEnum.NextRound ||
      matchCurrentRound.nextRoundType === NextRoundTypeEnum.NextRoundAndExtended
        ? matchCurrentRound.roundCount + 1
        : matchCurrentRound.roundCount

    const newExtendedRoundCount =
      matchCurrentRound.nextRoundType === NextRoundTypeEnum.Extended ||
      matchCurrentRound.nextRoundType === NextRoundTypeEnum.NextRoundAndExtended
        ? matchCurrentRound.extendedRoundCount + 1
        : 0

    const newMatchRound: MatchRound = {
      matchId,
      code: generateMatchRoundCode(
        matchId,
        newRoundCount,
        newExtendedRoundCount
      ),
      roundCount: newRoundCount,
      extendedRoundCount: newExtendedRoundCount,
      cumulatedThousands: matchCurrentRound.nextRoundCumulatedThousands,
      nextRoundCumulatedThousands: 0,
      resultType: RoundResultTypeEnum.Unknown,
      nextRoundType: NextRoundTypeEnum.Unknown,
      playerResults: formatPlayerResultsByPreviousPlayerResults(
        matchCurrentRound.playerResults
      ),
      doras: {},
    }

    pushMatchRound(newMatchRound)
  }, [matchCurrentRound, matchId, pushMatchRound])

  const handleClickStartOBS = useCallback(() => {
    setObsInfo({
      matchId,
    })
  }, [matchId, setObsInfo])

  const [activeWaitingTilesData, setActiveWaitingTilesData] = useState<{
    index: PlayerIndex
    tiles: string[]
  } | null>(null)
  const handleClickWaitingTiles = useCallback(
    (e: React.MouseEvent) => {
      const playerIndex = e.currentTarget.getAttribute(
        'data-player-index'
      ) as PlayerIndex
      if (
        typeof playerIndex === 'undefined' ||
        !matchCurrentRound?.playerResults[playerIndex]
      ) {
        return
      }

      setActiveWaitingTilesData({
        index: playerIndex,
        tiles: matchCurrentRound?.playerResults[playerIndex].waitingTiles ?? [],
      })
    },
    [matchCurrentRound?.playerResults]
  )

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
          ...(matchCurrentRound?.playerResults as Record<
            PlayerIndex,
            PlayerResult
          >),
          [activeWaitingTilesData.index]: {
            ...matchCurrentRound?.playerResults[activeWaitingTilesData.index],
            waitingTiles: newTiles,
          },
        },
      })
      setActiveWaitingTilesData(null)
    },
    [
      activeWaitingTilesData,
      matchCurrentRound?.playerResults,
      updateCurrentMatchRound,
    ]
  )

  const handleRemoveWaitingTileDoraKeyboard = useCallback(() => {
    if (!activeWaitingTilesData) {
      return
    }

    updateCurrentMatchRound({
      playerResults: {
        ...(matchCurrentRound?.playerResults as Record<
          PlayerIndex,
          PlayerResult
        >),
        [activeWaitingTilesData.index]: {
          ...matchCurrentRound?.playerResults[activeWaitingTilesData.index],
          waitingTiles: [],
        },
      },
    })
    setActiveWaitingTilesData(null)
  }, [
    activeWaitingTilesData,
    matchCurrentRound?.playerResults,
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
      if (!matchCurrentRound || !activePredictYakusData) {
        return
      }

      updateCurrentMatchRound({
        playerResults: {
          ...matchCurrentRound.playerResults,
          [activePredictYakusData.index]: {
            ...matchCurrentRound.playerResults[activePredictYakusData.index],
            detail: {
              ...matchCurrentRound.playerResults[activePredictYakusData.index]
                .detail,
              ...newDetail,
            },
          },
        },
      })

      setActivePredictYakusData(null)
    },
    [activePredictYakusData, matchCurrentRound, updateCurrentMatchRound]
  )

  const handleClickEditMatchName = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()

      if (!match) {
        return
      }

      const newName = prompt('對局名稱', match.name)
      if (newName) {
        setMatchName(newName)
      }
    },
    [match, setMatchName]
  )

  const handleClickBroadcastRonDetail = useCallback(
    (e: React.MouseEvent) => {
      if (!matchRounds) {
        return
      }

      const matchRoundId = e.currentTarget.getAttribute('data-match-round-id')
      if (!matchRoundId) {
        return
      }

      const newResultDetail = matchRounds[matchRoundId].resultDetail
      if (!newResultDetail) {
        return
      }

      setMatchActiveResultDetail(newResultDetail)
      setMatchRoundHasBroadcastedToTrue(matchRoundId)
      setActiveAnimationMessage('播放和牌中…')

      setTimeout(() => {
        setMatchActiveResultDetail(null)
        setActiveAnimationMessage(null)
      }, 20000)
    },
    [matchRounds, setMatchActiveResultDetail, setMatchRoundHasBroadcastedToTrue]
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

  useEffect(() => {
    if (matchCurrentRoundDoras.length === 0) {
      setClickedDoraIndex(-1)
    }
  }, [matchCurrentRoundDoras.length])

  if ((!match || !matchCurrentRound) && dbMatch) {
    return <ControlNewMatch dbMatch={dbMatch} />
  }

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-24 pb-32">
        <div className="space-y-6">
          <div className="flex flex-row items-center gap-x-4 text-white">
            <div
              className="p-2 pl-4 pr-10 flex items-center gap-x-8 transition-[width] text-[4rem]"
              style={{
                background: `linear-gradient(280deg, transparent, transparent 22px, #00000080 23px, #00000080 100%)`,
              }}
            >
              <div className="text-[0.5em]">
                <div className="text-[0.5em]">
                  <button type="button" onClick={handleClickEditMatchName}>
                    {match.name} <i className="bi bi-pencil"></i>
                  </button>
                </div>
                <div className="flex gap-x-8 items-center">
                  <div>
                    <MJMatchCounterSpan
                      roundCount={matchCurrentRound.roundCount}
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
                        {matchCurrentRound.extendedRoundCount ?? 0}
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
                        {matchCurrentRound.cumulatedThousands ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                {matchCurrentRoundDoras.map((dora, index) => (
                  <button
                    data-index={index}
                    onClick={handleClickDora}
                    className="hover:opacity-80"
                  >
                    <MJTileDiv
                      key={dora}
                      className="w-12 animate-[fadeInFromLeft_0.5s_ease-in-out]"
                    >
                      {dora}
                    </MJTileDiv>
                  </button>
                ))}

                <MJUIButton
                  type="button"
                  color={
                    matchCurrentRoundDoras.length === 0 ? 'danger' : 'secondary'
                  }
                  className={`${
                    matchCurrentRoundDoras.length === 0 && 'animate-bounce'
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

          <div className="flex justify-between gap-x-8 ">
            <div className="flex-1">
              <MJUITabs
                tabs={VIEW_TABS}
                defaultValue={VIEW_TABS[0].value}
                onChangeValue={setViewTabValue}
              />
            </div>

            <div className="text-right space-x-4">
              {match.activeResultDetail && (
                <MJUIButton
                  color="secondary"
                  type="button"
                  onClick={handleClickClearActiveResult}
                >
                  結束播放中的和牌詳情
                  <br />
                  <span className="text-xs">(或最多20秒後自動結束)</span>
                </MJUIButton>
              )}
              {matchCurrentRound.nextRoundType !== NextRoundTypeEnum.Unknown &&
                matchCurrentRound.nextRoundType !== NextRoundTypeEnum.End && (
                  <MJUIButton
                    color="success"
                    type="button"
                    className="animate-pulse"
                    onClick={handleClickGoNextRound}
                  >
                    進入
                    <MJMatchCounterSpan
                      roundCount={
                        matchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.NextRound ||
                        matchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.NextRoundAndExtended
                          ? matchCurrentRound.roundCount + 1
                          : matchCurrentRound.roundCount
                      }
                      extendedRoundCount={
                        matchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.Extended ||
                        matchCurrentRound.nextRoundType ===
                          NextRoundTypeEnum.NextRoundAndExtended
                          ? matchCurrentRound.extendedRoundCount + 1
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

          {viewTabValue === 'listView-old' && (
            <div className="space-y-4">
              {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
                <div className="flex gap-x-2 items-center">
                  <div className="flex-1 text-[2.5rem]">
                    <MJPlayerCardDiv
                      player={match.players[index]}
                      playerIndex={index}
                      score={matchCurrentRound.playerResults[index].afterScore}
                      scoreChanges={
                        matchCurrentRound.playerResults[index].scoreChanges
                      }
                      isEast={getIsPlayerEast(
                        index,
                        matchCurrentRound.roundCount
                      )}
                      isRiichi={matchCurrentRound.playerResults[index].isRiichi}
                      waitingTiles={
                        matchCurrentRound.playerResults[index].waitingTiles
                      }
                      onClickWaitingTiles={handleClickWaitingTiles}
                      isYellowCarded={
                        matchCurrentRound.playerResults[index].isYellowCarded
                      }
                      isRedCarded={
                        matchCurrentRound.playerResults[index].isRedCarded
                      }
                    />
                  </div>
                  {/* <div>
            <button
              type="button"
              className={`${
                matchCurrentRound.playerResults[index].isRevealed
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 opacity-30'
              } h-16 w-16 border-2 border-blue-600  rounded-full text-lg`}
              onClick={handleClickReveal}
              data-player-index={index}
            >
              {matchCurrentRound.playerResults[index].isRevealed
                ? '已副露'
                : '副露?'}
            </button>
          </div> */}
                  <div>
                    <button
                      type="button"
                      className={`${
                        matchCurrentRound.playerResults[index].isRiichi
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-orange-600 opacity-30'
                      } h-16 w-16 border-2 border-orange-600  rounded-full text-lg`}
                      onClick={handleClickRiichi}
                      data-player-index={index}
                    >
                      {matchCurrentRound.playerResults[index].isRiichi
                        ? '已立直'
                        : '立直?'}
                    </button>
                  </div>
                  <div className="pl-6">
                    <MJUIButton
                      color="danger"
                      type="button"
                      onClick={handleClickRon}
                      data-player-index={index}
                    >
                      和了
                    </MJUIButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewTabValue === 'listView-new' && (
            <PlayersListView
              players={match.players}
              currentRound={matchCurrentRound}
              onAction={handlePlayerListViewAction}
            />
          )}

          {viewTabValue === 'gridView' && (
            <PlayersGridView
              players={match.players}
              currentRound={matchCurrentRound}
              onAction={handlePlayerListViewAction}
            />
          )}
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
                <th>分數＆細節</th>
                <th className="text-right px-2">操作</th>
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
                        match.players[
                          matchRound.resultDetail!.winnerPlayerIndex
                        ].color,
                    }}
                  >
                    {
                      match.players[matchRound.resultDetail!.winnerPlayerIndex]
                        .name
                    }
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
                  <td className="text-right py-1 px-2">
                    <MJUIButton
                      color={matchRound.hasBroadcasted ? 'secondary' : 'danger'}
                      type="button"
                      className={matchRound.hasBroadcasted ? 'opacity-50' : ''}
                      onClick={handleClickBroadcastRonDetail}
                      data-match-round-id={matchRound.id}
                    >
                      <i className="bi bi-camera-reels"></i>{' '}
                      {matchRound.hasBroadcasted ? '再次播放' : '播放和牌詳情'}
                    </MJUIButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
              ? [matchCurrentRoundDoras[clickedDoraIndex]]
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
        round={matchCurrentRound.roundCount}
        activePlayerIndex={activePredictYakusData?.index ?? '0'}
        targetPlayerIndex={'-1'}
        open={!!activePredictYakusData}
        onClose={handleClosePredictYakusDialog}
        onSubmit={handleSubmitPredictYakusDialog}
        defaultValue={
          matchCurrentRound.playerResults[activePredictYakusData?.index ?? '0']
            .detail
        }
      />

      <MJUIDialogV2
        hideCloseButton
        open={
          matchCurrentRound.nextRoundType !== NextRoundTypeEnum.Unknown &&
          matchCurrentRound.nextRoundType !== NextRoundTypeEnum.End
        }
      >
        <div className="space-y-6 text-center">
          <p>
            當準備好時，點擊按鈕進入下一局。
            <br />
            如果發現分數有誤需要修改，請在下一局開始後，點擊頁面最下方的「手動調整分數」。
          </p>

          <div>
            <MJUIButton
              color="success"
              type="button"
              className="text-xl"
              onClick={handleClickGoNextRound}
            >
              進入
              <MJMatchCounterSpan
                roundCount={
                  matchCurrentRound.nextRoundType ===
                    NextRoundTypeEnum.NextRound ||
                  matchCurrentRound.nextRoundType ===
                    NextRoundTypeEnum.NextRoundAndExtended
                    ? matchCurrentRound.roundCount + 1
                    : matchCurrentRound.roundCount
                }
                extendedRoundCount={
                  matchCurrentRound.nextRoundType ===
                    NextRoundTypeEnum.Extended ||
                  matchCurrentRound.nextRoundType ===
                    NextRoundTypeEnum.NextRoundAndExtended
                    ? matchCurrentRound.extendedRoundCount + 1
                    : 0
                }
              />
            </MJUIButton>
          </div>
        </div>
      </MJUIDialogV2>

      <MJMatchRonDialog
        match={match}
        currentMatchRound={matchCurrentRound}
        open={isShowingRonDialog}
        onSubmit={handleSubmitMatchRonDialog}
        onClose={() => toggleRonDialog(false)}
        {...ronDialogProps}
      />

      <MJMatchExhaustedDialog
        match={match}
        currentMatchRound={matchCurrentRound}
        open={isShowingExhaustedDialog}
        onSubmit={handleSubmitMatchExhaustedDialog}
        onClose={() => toggleExhaustedDialog(false)}
        {...ronDialogProps}
      />

      <MJMatchHotfixDialog
        match={match}
        currentMatchRound={matchCurrentRound}
        open={isShowingHotfixDialog}
        onSubmit={handleSubmitMatchHotfixDialog}
        onClose={() => toggleHotfixDialog(false)}
        {...ronDialogProps}
      />
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
                {unboardcastedMatchRounds.map((matchRound) => (
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
                          match.players[
                            matchRound.resultDetail!.winnerPlayerIndex
                          ].color,
                      }}
                    >
                      {
                        match.players[
                          matchRound.resultDetail!.winnerPlayerIndex
                        ].name
                      }
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
                          isManganRoundUp={
                            match.setting.isManganRoundUp === '1'
                          }
                        />
                      </p>
                    </td>
                    <td className="text-right py-1 px-2">
                      <MJUIButton
                        color={
                          matchRound.hasBroadcasted ? 'secondary' : 'success'
                        }
                        type="button"
                        className={
                          matchRound.hasBroadcasted
                            ? 'opacity-50'
                            : 'animate-pulse'
                        }
                        onClick={handleClickBroadcastRonDetail}
                        data-match-round-id={matchRound.id}
                      >
                        {matchRound.hasBroadcasted
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

      <div className="fixed bottom-0 left-0 right-0 pl-6 pr-6 pb-6 z-50 flex justify-between items-end bg-gradient-to-b from-transparent to-[#00000080]">
        <div className="text-left">
          <button
            onClick={handleClickHotfix}
            className="relative rounded-full py-2 px-4 shadow shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 leading-6 text-neutral-600"
          >
            <i className="bi bi-pencil"></i> 手動調整分數
          </button>
        </div>

        <div className="flex gap-x-6 items-end">
          {!match.showPoints && (
            <button
              onClick={handleClickDisplayPoint}
              className="relative rounded-full py-2 px-4 shadow shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 leading-6 text-neutral-600"
            >
              <i className="bi bi-list-ol"></i> 切換播放馬點＆名次
            </button>
          )}
          {match.showPoints && (
            <button
              onClick={handleClickDisplayScore}
              className="relative rounded-full py-2 px-4 shadow shadow-neutral-700 text-center bg-green-300 border border-green-300 leading-6 text-green-800"
            >
              <i className="bi bi-list-ol"></i> 切換播放馬點＆名次
            </button>
          )}
          <button className="relative rounded-full p-5 shadow shadow-neutral-700 text-center bg-neutral-200 border border-neutral-300 text-4xl leading-6 text-neutral-600">
            {activeAnimationMessage ? (
              <span>
                <i className="bi bi-hourglass-split"></i>{' '}
                {activeAnimationMessage}
              </span>
            ) : (
              <i className="bi bi-camera-reels"></i>
            )}

            {unboardcastedMatchRounds.length > 0 && (
              <div className="absolute h-6 w-6 -top-1 -left-1 shadow shadow-neutral-700 bg-red-600 text-white text-sm rounded-full font-semibold">
                {unboardcastedMatchRounds.length}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
