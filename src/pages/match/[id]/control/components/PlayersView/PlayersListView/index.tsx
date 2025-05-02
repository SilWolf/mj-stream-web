import { PlayerIndex } from '@/models'
import { PlayersViewAction, PlayersViewProps } from '..'
import React, { useCallback } from 'react'
import MJTileDiv from '@/components/MJTileDiv'
import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import RevealPonKeyboard from './widgets/RevealPonKeyboard'
import RevealKanngKeyboard from './widgets/RevealKanngKeyboard'
import RevealChiKeyboard from './widgets/RevealChiKeyboard'

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
                          <RevealPonKeyboard />
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
                          <RevealChiKeyboard />
                        </div>
                      </div>
                    </div>

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
                          <RevealKanngKeyboard />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <button className="cursor-pointer px-2 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl">
                  暗槓
                </button>
              </div>
              <div className="text-[24px]">
                <MJTileCombinationDiv value="3ma-3m=3m3m 5p-0p=5p5p 4z-4z=4z4z 5z-5z=5z5z" />
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
                <button
                  className="flex h-16 items-center gap-x-2 cursor-pointer bg-base-100 hover:bg-base-200 px-2"
                  data-player-index={index}
                  data-action="waitingTile"
                  onClick={handleAction}
                >
                  <div>待牌</div>
                  {currentRound.playerResults[index].waitingTiles?.map(
                    (tile) => (
                      <MJTileDiv key={tile} className="w-10!">
                        {tile}
                      </MJTileDiv>
                    )
                  )}
                </button>
                <button
                  className="flex h-16 items-center gap-x-2 cursor-pointer bg-base-100 hover:bg-base-200 px-2"
                  data-player-index={index}
                  data-action="yaku"
                  onClick={handleAction}
                >
                  <div>役</div>
                  {currentRound.playerResults[index].detail.yakus?.map(
                    ({ label }) => <span key={label}>{label}</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-x-1 relative">
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
                    和上家
                  </button>
                  <button
                    className="px-1 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    和下家
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    className="px-1 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    和對家
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
