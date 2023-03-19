import React, { useCallback, useState } from 'react'
import useMatch from '@/hooks/useMatch'
import {
  MatchRound,
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
import MJUIDialog from '@/components/MJUI/MJUIDialog'
import MJTileKeyboardDiv from '@/components/MJTileKeyboardDiv'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'

const PLAYER_CARD_CLASSNAME_MAP: Record<PlayerIndex, string> = {
  0: '!bg-blue-400',
  1: '!bg-red-400',
  2: '!bg-green-400',
  3: '!bg-yellow-400',
}

type Props = {
  params: { matchId: string }
}

export default function MatchControlPage({ params: { matchId } }: Props) {
  const {
    match,
    matchCurrentRound,
    matchCurrentRoundDoras,
    updateCurrentMatchRound,
    pushMatchRound,
    setCurrentRoundDoras,
  } = useMatch(matchId)

  const [clickedDoraIndex, setClickedDoraIndex] = useState<number | undefined>(
    undefined
  )

  const [isShowingRonDialog, toggleRonDialog] = useBoolean(false)
  const [ronDialogProps, setRonDialogProps] = useState<
    Pick<MJMatchRonProps, 'initialActivePlayerIndex'>
  >({ initialActivePlayerIndex: '0' })
  const confirmDialog = useConfirmDialog()

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
            isRevealed: true,
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

      confirmDialog.showConfirmDialog({
        title: '確定要立直嗎？',
        content: `一旦點擊確定，就會播出立直動畫，請確定立直的是 ${player.name}！`,
        onClickOk: async () => {
          updateCurrentMatchRound({
            playerResults: {
              ...(matchCurrentRound?.playerResults as Record<
                PlayerIndex,
                PlayerResult
              >),
              [playerIndex]: {
                ...matchCurrentRound?.playerResults[playerIndex],
                isRiichi: true,
              },
            },
          })
          return new Promise((res) => {
            setTimeout(res, 3000)
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
    (tileKey: MJTileKey) => {
      if (typeof clickedDoraIndex !== 'undefined') {
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

  const handleSubmitMatchRonDialog = useCallback(
    (updatedMatchRound: MatchRound) => {
      try {
        const eastPlayerIndex = getPlayerIndexOfEastByRound(
          updatedMatchRound.roundCount
        )
        const isGoExtendedRound =
          updatedMatchRound.playerResults[eastPlayerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Win
        const isGameEnded =
          !isGoExtendedRound && updatedMatchRound.roundCount >= 8

        const newRoundCount = isGoExtendedRound
          ? updatedMatchRound.roundCount
          : updatedMatchRound.roundCount + 1
        const newExtendedRoundCount = isGoExtendedRound
          ? updatedMatchRound.extendedRoundCount + 1
          : 0

        const newMatchRound: MatchRound = {
          matchId,
          code: generateMatchRoundCode(
            matchId,
            updatedMatchRound.roundCount,
            updatedMatchRound.extendedRoundCount
          ),
          roundCount: newRoundCount,
          extendedRoundCount: newExtendedRoundCount,
          cumulatedThousands: 0,
          resultType: RoundResultTypeEnum.Unknown,
          playerResults: formatPlayerResultsByPreviousPlayerResults(
            updatedMatchRound.playerResults
          ),
          doras: {},
        }

        updateCurrentMatchRound(updatedMatchRound)
        pushMatchRound(newMatchRound)

        toggleRonDialog(false)

        if (isGameEnded) {
          // TODO: Proceed to Game End
          alert('對局結束。')

          return
        }
      } catch (e) {
        console.error(e)
      }
    },
    [matchId, pushMatchRound, toggleRonDialog, updateCurrentMatchRound]
  )

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="w-full bg-white">
        <div className="flex">
          <div className="border-r border-gray-200">
            <button type="button" className="p-2 leading-none">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          <div className="flex-1" />
        </div>
      </div>

      <div className="container mx-auto mt-8 px-8 space-y-6">
        <div className="flex flex-row items-stretch gap-x-4 text-white">
          <div className="rounded-[1rem] bg-black bg-opacity-50 p-2 flex items-stretch gap-x-4">
            <div className="font-ud text-[2.5rem] border-[.25rem] rounded-[.75rem] px-4 border-current flex items-center justify-center">
              <MJMatchCounterSpan roundCount={matchCurrentRound.roundCount} />
            </div>
            <div className="flex flex-col justify-around">
              <div className="flex-1 flex flex-row items-center gap-x-2">
                <div className="flex-1">
                  <img
                    src="/images/score-hundred.png"
                    alt="hundred"
                    className="h-4"
                  />
                </div>
                <div className="font-ud">
                  {matchCurrentRound.extendedRoundCount ?? 0}
                </div>
              </div>
              <div className="flex-1 flex flex-row items-center gap-x-2">
                <div className="flex-1">
                  <img
                    src="/images/score-thousand.png"
                    alt="thousand"
                    className="h-4"
                  />
                </div>
                <div className="font-ud">
                  {matchCurrentRound.cumulatedThousands ?? 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {matchCurrentRoundDoras.map((dora, index) => (
                <MJTileDiv
                  key={dora}
                  className="w-9 cursor-pointer"
                  data-index={index}
                  onClick={handleClickDora}
                >
                  {dora}
                </MJTileDiv>
              ))}
              <div>
                <button
                  type="button"
                  className="rounded-full border border-white h-16 w-16 text-sm"
                  data-index="-1"
                  onClick={handleClickDora}
                >
                  +懸賞
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" />
        </div>

        <div className="space-y-4">
          {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
            <div className="flex gap-x-2 items-center">
              <div className="flex-1 text-[2.5rem]">
                <MJPlayerCardDiv
                  name={match.players[index].name}
                  title={match.players[index].title}
                  score={matchCurrentRound.playerResults[index].beforeScore}
                  scoreChanges={
                    matchCurrentRound.playerResults[index].prevScoreChanges
                  }
                  isEast={getIsPlayerEast(index, matchCurrentRound.roundCount)}
                  className={`${PLAYER_CARD_CLASSNAME_MAP[index]} !bg-opacity-60`}
                />
              </div>
              <div>
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
              </div>
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
                <button
                  type="button"
                  className="bg-red-100 text-red-600 h-12 w-16 rounded text-lg"
                  onClick={handleClickRon}
                  data-player-index={index}
                >
                  和了
                </button>
              </div>
            </div>
          ))}
        </div>

        <MJMatchHistoryTable matchId={matchId} className="w-full table-auto" />
      </div>

      <MJUIDialog
        open={typeof clickedDoraIndex !== 'undefined'}
        title="選擇懸賞"
        onClose={handleCloseDoraKeyboard}
      >
        <MJTileKeyboardDiv
          onSubmit={handleSubmitDoraKeyboard}
          onRemove={handleRemoveDoraKeyboard}
          canRemove={
            typeof clickedDoraIndex !== 'undefined' && clickedDoraIndex > 0
          }
        />
      </MJUIDialog>

      <MJMatchRonDialog
        match={match}
        currentMatchRound={matchCurrentRound}
        open={isShowingRonDialog}
        onSubmit={handleSubmitMatchRonDialog}
        onClose={toggleRonDialog}
        {...ronDialogProps}
      />
    </div>
  )
}
