import { PlayerIndex } from '@/models'
import { PlayersViewAction, PlayersViewProps } from '..'
import React, { useCallback } from 'react'
import MJTileDiv from '@/components/MJTileDiv'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'

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
                className="p-1 text-white w-32"
                style={{ background: players[index].color }}
              >
                <div className="flex gap-x-1 items-center w-32">
                  <img
                    className="shrink-0 w-8 h-8 inline-block"
                    src={players[index].teamPicUrl as string}
                    alt={players[index].title}
                  />
                  <img
                    className="shrink-0 w-[1.44rem] h-8 inline-block"
                    src={players[index].proPicUrl as string}
                    alt={players[index].name}
                  />
                  <div className="flex-1 align-middle overflow-hidden">
                    <p className="whitespace-nowrap overflow-ellipsis">
                      {players[index].title}
                    </p>
                    <p className="whitespace-nowrap overflow-ellipsis">
                      {players[index].name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-2 border-b border-black" colSpan={2}>
                <button
                  className="py-2 text-left block"
                  data-player-index={index}
                  data-action="waitingTile"
                  onClick={handleAction}
                >
                  <span className="mr-2 text-xl">待牌</span>
                  <div className="inline-block space-x-1">
                    {currentRound.playerResults[index].waitingTiles?.map(
                      (tile) => (
                        <MJTileDiv
                          key={tile}
                          className="inline-block align-middle w-8 animate-[fadeInFromLeft_1s_ease-in-out]"
                        >
                          {tile}
                        </MJTileDiv>
                      )
                    )}
                  </div>
                </button>
              </td>
              <td className="whitespace-nowrap w-0 space-y-1 pr-1" rowSpan={2}>
                <div className="space-x-1">
                  <button
                    className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-teal-800 data-[active='1']:text-yellow-300"
                    data-player-index={index}
                    data-action="reveal"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[index].isRevealed ? '1' : '0'
                    }
                    disabled={currentRound.playerResults[index].isRiichi}
                  >
                    副露
                  </button>
                  <button
                    className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-before"
                    onClick={handleAction}
                  >
                    和上家
                  </button>
                </div>
                <div className="space-x-1">
                  <button
                    className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-red-800 data-[active='1']:text-yellow-300"
                    data-player-index={index}
                    data-action="riichi"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[index].isRiichi ? '1' : '0'
                    }
                    disabled={currentRound.playerResults[index].isRevealed}
                  >
                    立直
                  </button>
                  <button
                    className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    和對家
                  </button>
                </div>
                <div className="space-x-1">
                  <button
                    className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-self"
                    onClick={handleAction}
                  >
                    自摸
                  </button>
                  <button
                    className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={index}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    和下家
                  </button>
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
                    {currentRound.playerResults[index].detail.yakusInText?.map(
                      (yakuText) => <span key={yakuText}>{yakuText}</span>
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
                    赤{currentRound.playerResults[index].detail.redDora ?? 0}
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
      ))}
    </div>
  )
}

export default PlayersListView
