import { PlayerIndex } from '@/models'
import { PlayersViewAction, PlayersViewProps } from '..'
import React, { useCallback } from 'react'
import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import RevealPonKeyboard from './widgets/RevealPonKeyboard'
import RevealKanngKeyboard from './widgets/RevealKanngKeyboard'
import RevealChiKeyboard from './widgets/RevealChiKeyboard'
import RevealEditKeyboard from './widgets/RevealEditKeyboard'
import {
  getAfterOfPlayerIndex,
  getBeforeOfPlayerIndex,
  getOppositeOfPlayerIndex,
} from '@/helpers/mahjong.helper'
import MJTileV2Div from '@/components/MJTileV2Div'
import SelectNumber from '@/components/v2/inputs/SelectNumber'

const PlayersListView = ({
  players,
  currentRound,
  onAction,
}: PlayersViewProps) => {
  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPlayerIndex = e.currentTarget.getAttribute(
        'data-player-index'
      ) as PlayerIndex
      const action = e.currentTarget.getAttribute(
        'data-action'
      ) as PlayersViewAction

      onAction(newPlayerIndex, action)
    },
    [onAction]
  )

  const handleClickAddReveal = useCallback(
    (index: PlayerIndex) => (newReveal: string) => {
      onAction(index, 'push-reveal', newReveal)
      ;(
        document.getElementById(
          `player${index}-popover-pon-keyboard`
        ) as HTMLElement
      ).hidePopover()
      ;(
        document.getElementById(
          `player${index}-popover-chi-keyboard`
        ) as HTMLElement
      ).hidePopover()
      ;(
        document.getElementById(
          `player${index}-popover-kanng-keyboard`
        ) as HTMLElement
      ).hidePopover()
    },
    [onAction]
  )

  const handleClickReplaceReveal = useCallback(
    (index: PlayerIndex, ci: number) =>
      (oldReveal: string, newReveal: string) => {
        onAction(index, 'replace-reveal', [oldReveal, newReveal])
        ;(
          document.getElementById(
            `player${index}-reveal-${ci}-popover-edit-keyboard`
          ) as HTMLElement
        )?.hidePopover()
      },
    [onAction]
  )
  const handleClickDeleteReveal = useCallback(
    (index: PlayerIndex, ci: number) => (oldReveal: string) => {
      onAction(index, 'delete-reveal', oldReveal)
      ;(
        document.getElementById(
          `player${index}-reveal-${ci}-popover-edit-keyboard`
        ) as HTMLElement
      )?.hidePopover()
    },
    [onAction]
  )

  const handleClickWaitingTileRemain = useCallback(
    (index: PlayerIndex) => (newValue: number | null) => {
      onAction(index, 'waiting-tile-remain', newValue)
    },
    [onAction]
  )

  const handleClickDora = useCallback(
    (index: PlayerIndex) => (newValue: number | null) => {
      onAction(index, 'dora', newValue)
    },
    [onAction]
  )

  const handleClickRedDora = useCallback(
    (index: PlayerIndex) => (newValue: number | null) => {
      onAction(index, 'red-dora', newValue)
    },
    [onAction]
  )

  return (
    <div className="space-y-2">
      {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
        <div className="flex gap-2 py-8 border-t border-t-base-300">
          <div className="shrink-0 flex flex-col gap-1">
            <button
              className="text-gray-900 text-xs px-1 rounded-sm"
              style={{
                backgroundColor: '#ffe100',
                width: '2rem',
                height: '2.5rem',
                top: '0rem',
                left: '-2.5rem',
                opacity: currentRound.playerResults[index].isYellowCarded
                  ? 1
                  : 0.35,
              }}
              data-player-index={index}
              data-action="yellow-card"
              onClick={handleAction}
            >
              黃牌
            </button>
            <button
              className="text-gray-900 text-xs px-1 rounded-sm"
              style={{
                backgroundColor: '#ff1900',
                width: '2rem',
                height: '2.5rem',
                top: '2.7rem',
                left: '-2.5rem',
                opacity: currentRound.playerResults[index].isRedCarded
                  ? 1
                  : 0.35,
              }}
              data-player-index={index}
              data-action="red-card"
              onClick={handleAction}
            >
              紅牌
            </button>
            <button
              className="text-gray-900 text-xs px-1 rounded-sm"
              style={{
                border: '1px solid #333',
                borderColor: currentRound.playerResults[index].isRonDisallowed
                  ? '#f00'
                  : '#333',
                color: currentRound.playerResults[index].isRonDisallowed
                  ? '#fff'
                  : '#000',
                background: currentRound.playerResults[index].isRonDisallowed
                  ? '#f00'
                  : 'transparent',
                width: '2rem',
                height: '2.5rem',
                top: '2.7rem',
                left: '-2.5rem',
                opacity: currentRound.playerResults[index].isRonDisallowed
                  ? 1
                  : 0.35,
              }}
              data-player-index={index}
              data-action="disallow-ron"
              onClick={handleAction}
            >
              {/* <i className="bi bi-ban"></i> */}
              <div className="whitespace-nowrap">和了</div>
              <div className="whitespace-nowrap">禁止</div>
            </button>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-2 items-center">
              <span className="w-32 overflow-hidden">
                {players[index].primaryName}
              </span>
              <button
                className="cursor-pointer px-4 h-10 bg-neutral-200 border border-neutral-700 text-xl disabled:opacity-20 disabled:cursor-not-allowed data-[active=true]:bg-red-800 data-[active=true]:text-yellow-300"
                data-player-index={index}
                data-action="riichi"
                onClick={handleAction}
                data-active={
                  currentRound.playerResults[index].isRiichi ? true : false
                }
                disabled={currentRound.playerResults[index].isRevealed}
              >
                立直
              </button>
              <div className="space-x-1 ml-2">
                {!currentRound.playerResults[index].isRiichi && (
                  <>
                    <button
                      className="cursor-pointer px-2 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                      popoverTarget={`player${index}-popover-pon-keyboard`}
                      style={
                        {
                          anchorName: `--player${index}-anchor-pon-keyboard`,
                        } as React.CSSProperties
                      }
                    >
                      碰
                    </button>
                    <div
                      className="dropdown dropdown-center dropdown-top rounded-box bg-base-100 shadow-sm"
                      popover="auto"
                      id={`player${index}-popover-pon-keyboard`}
                      style={
                        {
                          positionAnchor: `--player${index}-anchor-pon-keyboard`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="card border border-base-300 shadow mb-1">
                        <div className="card-content p-2 text-[32px]">
                          <RevealPonKeyboard
                            onClick={handleClickAddReveal(index)}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      className="cursor-pointer px-2 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                      popoverTarget={`player${index}-popover-chi-keyboard`}
                      style={
                        {
                          anchorName: `--player${index}-anchor-chi-keyboard`,
                        } as React.CSSProperties
                      }
                    >
                      吃
                    </button>
                    <div
                      className="dropdown dropdown-center dropdown-top rounded-box bg-base-100 shadow-sm"
                      popover="auto"
                      id={`player${index}-popover-chi-keyboard`}
                      style={
                        {
                          positionAnchor: `--player${index}-anchor-chi-keyboard`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="card border border-base-300 shadow mb-1">
                        <div className="card-content p-2 text-[32px]">
                          <RevealChiKeyboard
                            onClick={handleClickAddReveal(index)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  className="cursor-pointer px-2 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                  popoverTarget={`player${index}-popover-kanng-keyboard`}
                  style={
                    {
                      anchorName: `--player${index}-anchor-kanng-keyboard`,
                    } as React.CSSProperties
                  }
                >
                  槓
                </button>
                <div
                  className="dropdown dropdown-center dropdown-top rounded-box bg-base-100 shadow-sm"
                  popover="auto"
                  id={`player${index}-popover-kanng-keyboard`}
                  style={
                    {
                      positionAnchor: `--player${index}-anchor-kanng-keyboard`,
                    } as React.CSSProperties
                  }
                >
                  <div className="card border border-base-300 shadow mb-1">
                    <div className="card-content p-2 text-[32px]">
                      <RevealKanngKeyboard
                        onClick={handleClickAddReveal(index)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-1 text-[24px] **:data-button:cursor-pointer **:data-button:p-1 **:data-button:hover:bg-base-200">
                {currentRound.playerResults[index].reveals?.map(
                  (combination, ci) => (
                    <React.Fragment key={ci}>
                      <button
                        data-button
                        popoverTarget={`player${index}-reveal-${ci}-popover-edit-keyboard`}
                        style={
                          {
                            anchorName: `--player${index}-reveal-${ci}-anchor-edit-keyboard`,
                          } as React.CSSProperties
                        }
                      >
                        <MJTileCombinationDiv value={combination} />
                      </button>
                      <div
                        className="dropdown dropdown-center dropdown-top rounded-box bg-base-100 shadow-sm"
                        popover="auto"
                        id={`player${index}-reveal-${ci}-popover-edit-keyboard`}
                        style={
                          {
                            positionAnchor: `--player${index}-reveal-${ci}-anchor-edit-keyboard`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="card border border-base-300 shadow mb-1">
                          <div className="card-content p-2 text-[32px]">
                            <RevealEditKeyboard
                              value={combination}
                              onClickReplace={handleClickReplaceReveal(
                                index,
                                ci
                              )}
                              onClickDelete={handleClickDeleteReveal(index, ci)}
                            />
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>

            <div className="flex items-stretch mt-1">
              <div
                className="flex items-center justify-center px-2 text-white text-4xl w-32"
                style={{ background: players[index].color }}
              >
                {currentRound.playerResults[index].afterScore}
              </div>
              <div className="flex-1 flex flex-col justify-around gap-1">
                <div className="flex items-center gap-x-2">
                  <button
                    className="flex h-12 items-center gap-x-2 bg-base-100 data-[is-furiten=true]:data-[is-waiting]:bg-red-500/50 data-[is-waiting]:bg-green-500/50 px-2 min-w-[200px] cursor-pointer"
                    data-player-index={index}
                    data-action="waitingTile"
                    data-is-waiting={
                      currentRound.playerResults[index].waitingTiles &&
                      currentRound.playerResults[index].waitingTiles.length > 0
                    }
                    data-is-furiten={
                      currentRound.playerResults[index].isFuriten
                    }
                    onClick={handleAction}
                  >
                    {currentRound.playerResults[index].isFuriten ? (
                      <div className="text-red-700">
                        <i className="bi bi-exclamation-diamond"></i> 振聽
                      </div>
                    ) : (
                      <div>待牌</div>
                    )}

                    <div className="flex gap-1 text-[28px]">
                      {currentRound.playerResults[index].waitingTiles?.map(
                        (tile) => <MJTileV2Div key={tile} value={tile} />
                      )}
                    </div>
                  </button>
                  {currentRound.playerResults[index].waitingTiles &&
                    currentRound.playerResults[index].waitingTiles.length >
                      0 && (
                      <div className="flex-1">
                        <div className="inline-flex items-stretch gap-x-2 border-1 border-primary pr-1">
                          <span className="content-center bg-primary text-primary-content px-2">
                            山餘
                          </span>
                          <span className="text-[40px]">
                            <SelectNumber
                              value={
                                currentRound.playerResults[index]
                                  .waitingTileRemain
                              }
                              onClick={handleClickWaitingTileRemain(index)}
                            />
                          </span>
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex items-center gap-x-2">
                  <button
                    className="flex-1 flex h-12 items-center gap-x-2cursor-pointer bg-base-100 hover:bg-base-200 px-2 cursor-pointer"
                    data-player-index={index}
                    data-action="yaku"
                    onClick={handleAction}
                  >
                    <div>役</div>
                    {currentRound.playerResults[index].detail.yakus?.map(
                      ({ label }) => <span key={label}>{label}</span>
                    )}
                  </button>

                  <div className="flex gap-x-1">
                    <div className="inline-flex items-stretch gap-x-2 border-4 border-yellow-300 bg-yellow-300 pr-1">
                      <span className="content-center px-2">寶牌</span>
                      <span className="text-[40px]">
                        <SelectNumber
                          value={currentRound.playerResults[index].detail.dora}
                          onClick={handleClickDora(index)}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-x-1">
                    <div className="inline-flex items-stretch gap-x-2 border-4 border-red-300 bg-red-300 pr-1">
                      <span className="content-center px-2">赤牌</span>
                      <span className="text-[40px]">
                        <SelectNumber
                          value={
                            currentRound.playerResults[index].detail.redDora
                          }
                          onClick={handleClickRedDora(index)}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x-1 relative ml-4">
                <div className="flex flex-col gap-1">
                  <button
                    className="px-1 h-10 w-16 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-self"
                    onClick={handleAction}
                  >
                    自摸
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    className="px-1 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-before"
                    onClick={handleAction}
                  >
                    和
                    {players[getBeforeOfPlayerIndex(index)].nickname || '上家'}
                  </button>
                  <button
                    className="px-1 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    和{players[getAfterOfPlayerIndex(index)].nickname || '下家'}
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    className="px-1 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    和
                    {players[getOppositeOfPlayerIndex(index)].nickname ||
                      '對家'}
                  </button>
                </div>
                {currentRound.playerResults[index].isRonDisallowed && (
                  <div className="absolute inset-0 bg-red-500 text-white text-lg opacity-90 flex items-center justify-center">
                    <i className="bi bi-ban"></i> 和了禁止
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayersListView
