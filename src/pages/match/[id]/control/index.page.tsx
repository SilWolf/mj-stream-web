/* eslint-disable no-nested-ternary */
import React, { MouseEvent, useCallback, useMemo, useState } from 'react'
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
  getIsPlayerEast,
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

const VIEW_TABS = [
  {
    label: '列表（舊版）',
    value: 'listView-old',
  },
  {
    label: '列表（新版）',
    value: 'listView-new',
  },
  {
    label: '2x2',
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

  const [clickedDoraIndex, setClickedDoraIndex] = useState<number | undefined>(
    undefined
  )

  const [viewTabValue, setViewTabValue] = useState<string>(VIEW_TABS[0].value)

  const [isShowingRonDialog, toggleRonDialog] = useBoolean(false)
  const [ronDialogProps, setRonDialogProps] = useState<
    Pick<MJMatchRonProps, 'initialActivePlayerIndex'>
  >({ initialActivePlayerIndex: '0' })
  const confirmDialog = useConfirmDialog()

  const [isShowingExhaustedDialog, toggleExhaustedDialog] = useBoolean(false)
  const [isShowingHotfixDialog, toggleHotfixDialog] = useBoolean(false)

  const handleClickReveal = useCallback(
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

      updateCurrentMatchRound({
        playerResults: {
          ...(matchCurrentRound?.playerResults as Record<
            PlayerIndex,
            PlayerResult
          >),
          [playerIndex]: {
            ...matchCurrentRound?.playerResults[playerIndex],
            isRevealed:
              !matchCurrentRound?.playerResults[playerIndex].isRevealed,
          },
        },
      })
    },
    [match?.players, matchCurrentRound?.playerResults, updateCurrentMatchRound]
  )

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
          return new Promise((res) => {
            setTimeout(res, isDoingRiichi ? 3000 : 10)
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
          doras: {},
        }

        pushMatchRound(newMatchRound)

        toggleHotfixDialog(false)
      } catch (e) {
        console.error(e)
      }
    },
    [matchId, pushMatchRound, toggleHotfixDialog, updateCurrentMatchRound]
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
    setClickedDoraIndex(-1)
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

      setTimeout(() => {
        setMatchActiveResultDetail(null)
      }, 20000)
    },
    [matchRounds, setMatchActiveResultDetail, setMatchRoundHasBroadcastedToTrue]
  )

  const handleClickClearActiveResult = useCallback(() => {
    setMatchActiveResultDetail(null)
  }, [setMatchActiveResultDetail])

  if ((!match || !matchCurrentRound) && dbMatch) {
    return <ControlNewMatch dbMatch={dbMatch} />
  }

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <div className="flex flex-row items-center gap-x-4 text-white">
          <div
            className="p-2 pl-4 pr-10 flex items-center gap-x-8 transition-[width] text-[4rem]"
            style={{
              background: `linear-gradient(280deg, transparent, transparent 22px, #00000080 23px, #00000080 100%)`,
            }}
          >
            <div className="text-[0.5em]">
              <div className="text-[0.5em]">
                {match.name}{' '}
                <button type="button" onClick={handleClickEditMatchName}>
                  <span className="material-symbols-outlined text-sm underline decoration-dotted">
                    edit
                  </span>
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
                    className="w-12 animate-[fadeIn_0.5s_ease-in-out]"
                  >
                    {dora}
                  </MJTileDiv>
                </button>
              ))}

              <MJUIButton
                type="button"
                color="secondary"
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

        <MJUITabs
          tabs={VIEW_TABS}
          defaultValue={VIEW_TABS[0].value}
          onChangeValue={setViewTabValue}
        />

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
          />
        )}

        {viewTabValue === 'gridView' && (
          <PlayersGridView
            players={match.players}
            currentRound={matchCurrentRound}
          />
        )}

        <h4 className="text-3xl">和牌記錄</h4>

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
                      match.players[matchRound.resultDetail!.winnerPlayerIndex]
                        .color,
                  }}
                >
                  {
                    match.players[matchRound.resultDetail!.winnerPlayerIndex]
                      .name
                  }
                </td>
                <td className="text-center py-1">
                  <p>{matchRound.resultDetail!.yakusInText.join(' ')}</p>
                  <p>
                    <MJHanFuTextSpan
                      han={Math.min(
                        matchRound.resultDetail!.isYakuman ? 13 : 12,
                        matchRound.resultDetail!.han
                      )}
                      fu={matchRound.resultDetail!.fu}
                      isManganRoundUp={match.setting.isManganRoundUp === '1'}
                    />
                  </p>
                </td>
                <td className="text-right py-1 px-2">
                  <MJUIButton
                    color={matchRound.hasBroadcasted ? 'secondary' : 'success'}
                    type="button"
                    className={
                      matchRound.hasBroadcasted ? 'opacity-50' : 'animate-pulse'
                    }
                    onClick={handleClickBroadcastRonDetail}
                    data-match-round-id={matchRound.id}
                  >
                    {matchRound.hasBroadcasted ? '已播放過' : '播放和牌詳情'}
                  </MJUIButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="text-3xl">分數</h4>

        <MJMatchHistoryTable
          players={match.players}
          matchRounds={matchRounds ?? {}}
          className="w-full table-auto"
        />

        <div>
          <MJUIButton
            color="secondary"
            type="button"
            onClick={handleClickHotfix}
          >
            手動調整分數
          </MJUIButton>
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
    </div>
  )
}
