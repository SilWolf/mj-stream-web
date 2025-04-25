import { PlayerIndex } from '@/models'
import { PlayersViewAction, PlayersViewProps } from '..'
import React, { useCallback } from 'react'
import MJTileDiv from '@/components/MJTileDiv'
import {
  getAfterOfPlayerIndex,
  getBeforeOfPlayerIndex,
  getIsPlayerEast,
  getOppositeOfPlayerIndex,
} from '@/helpers/mahjong.helper'

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
        <div className="flex gap-2">
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
            <table
              className="w-full border border-black ring-2 ring-transparent data-[east='1']:ring-red-500 bg-white"
              key={index}
              data-east={
                getIsPlayerEast(index, currentRound.roundCount) ? '1' : '0'
              }
            >
              <tbody>
                <tr>
                  <td
                    className="p-1 text-white w-32 relative"
                    style={{ background: players[index].color }}
                  >
                    <div className="flex gap-x-1 items-center w-32">
                      <img
                        className="shrink-0 w-8 h-8 inline-block"
                        src={players[index].logoUrl as string}
                        alt={players[index].secondaryName}
                      />
                      <img
                        className="shrink-0 w-[1.44rem] h-8 inline-block"
                        src={players[index].propicUrl as string}
                        alt={players[index].primaryName}
                      />
                      <div className="flex-1 align-middle overflow-hidden">
                        <p className="whitespace-nowrap text-ellipsis">
                          {players[index].secondaryName}
                        </p>
                        <p className="whitespace-nowrap text-ellipsis">
                          {players[index].nickname ||
                            players[index].primaryName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 border-b border-black" colSpan={2}>
                    <button
                      className="py-2 w-full flex gap-x-1 items-stretch"
                      data-player-index={index}
                      data-action="waitingTile"
                      onClick={handleAction}
                    >
                      <span className="mr-2 text-xl">待牌</span>
                      <div className="flex-1 gap-x-[2px] flex justify-start">
                        {currentRound.playerResults[index].waitingTiles?.map(
                          (tile) => (
                            <MJTileDiv key={tile} className="w-10!">
                              {tile}
                            </MJTileDiv>
                          )
                        )}
                      </div>
                    </button>
                  </td>
                  <td
                    className="whitespace-nowrap w-0 space-y-1 pr-1"
                    rowSpan={2}
                  >
                    <div className="flex items-center gap-x-1">
                      <div className="flex flex-col gap-2 self-stretch">
                        <button
                          className="flex-1 h-16 w-16 bg-neutral-200 border rounded-full border-neutral-700 text-xl disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-red-800 data-[active='1']:text-yellow-300"
                          data-player-index={index}
                          data-action="riichi"
                          onClick={handleAction}
                          data-active={
                            currentRound.playerResults[index].isRiichi
                              ? '1'
                              : '0'
                          }
                          disabled={
                            currentRound.playerResults[index].isRevealed
                          }
                        >
                          立直
                        </button>

                        <button
                          className="flex-1 px-1 bg-neutral-200 border rounded-sm border-neutral-700 text-xl disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-teal-800 data-[active='1']:text-yellow-300"
                          data-player-index={index}
                          data-action="reveal"
                          onClick={handleAction}
                          data-active={
                            currentRound.playerResults[index].isRevealed
                              ? '1'
                              : '0'
                          }
                          disabled={currentRound.playerResults[index].isRiichi}
                        >
                          副露
                        </button>
                      </div>

                      <div className="flex items-center gap-x-1 relative">
                        <div className="flex flex-col gap-1">
                          <button
                            className="px-1 ml-3 h-12 w-16 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                            data-player-index={index}
                            data-action="ron-self"
                            onClick={handleAction}
                          >
                            自摸
                          </button>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            className="px-1 mr-4 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                            data-player-index={index}
                            data-action="ron-before"
                            onClick={handleAction}
                          >
                            和
                            {players[getBeforeOfPlayerIndex(index)].nickname ||
                              '上家'}
                          </button>
                          <button
                            className="px-1 ml-4 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                            data-player-index={index}
                            data-action="ron-opposite"
                            onClick={handleAction}
                          >
                            和
                            {players[getOppositeOfPlayerIndex(index)]
                              .nickname || '對家'}
                          </button>

                          <button
                            className="px-1 mr-4 h-10 bg-neutral-200 border rounded-sm border-neutral-700 text-xl"
                            data-player-index={index}
                            data-action="ron-after"
                            onClick={handleAction}
                          >
                            和
                            {players[getAfterOfPlayerIndex(index)].nickname ||
                              '下家'}
                          </button>
                        </div>
                        {currentRound.playerResults[index].isRonDisallowed && (
                          <div className="absolute inset-0 bg-red-500 text-white text-lg opacity-90 flex items-center justify-center">
                            <i className="bi bi-ban"></i> 和了禁止
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    className="p-1 space-x-1 text-white text-4xl"
                    style={{ background: players[index].color }}
                  >
                    {currentRound.playerResults[index].afterScore}
                  </td>
                  <td className="px-2">
                    <button
                      className="py-2 text-left text-xl"
                      data-player-index={index}
                      data-action="yaku"
                      onClick={handleAction}
                    >
                      <span className="mr-2 text-xl">役</span>
                      <div className="inline-block space-x-1">
                        {currentRound.playerResults[index].detail.yakus?.map(
                          ({ label }) => <span key={label}>{label}</span>
                        )}
                      </div>
                    </button>
                  </td>
                  <td className="w-0 text-right whitespace-nowrap px-4">
                    <div>
                      <div
                        className="data-[active='1']:bg-yellow-200"
                        data-active={
                          currentRound.playerResults[index].detail.dora > 0
                            ? '1'
                            : '0'
                        }
                      >
                        <button
                          className="px-2 text-lg leading-0"
                          data-player-index={index}
                          data-action="dora-normal-minus"
                          onClick={handleAction}
                        >
                          -
                        </button>
                        寶{currentRound.playerResults[index].detail.dora}
                        <button
                          className="px-2 text-lg leading-0"
                          data-player-index={index}
                          data-action="dora-normal-plus"
                          onClick={handleAction}
                        >
                          +
                        </button>
                      </div>
                      <div
                        className="data-[active='1']:bg-red-200"
                        data-active={
                          currentRound.playerResults[index].detail.redDora > 0
                            ? '1'
                            : '0'
                        }
                      >
                        <button
                          className="px-2 text-lg leading-0"
                          data-player-index={index}
                          data-action="dora-red-minus"
                          onClick={handleAction}
                        >
                          -
                        </button>
                        赤
                        {currentRound.playerResults[index].detail.redDora ?? 0}
                        <button
                          className="px-2 text-lg leading-0"
                          data-player-index={index}
                          data-action="dora-red-plus"
                          onClick={handleAction}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayersListView
