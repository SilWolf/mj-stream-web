import { PlayerIndex } from '@/models'
import { PlayersViewAction, PlayersViewProps } from '..'
import React, { useCallback, useMemo, useState } from 'react'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJTileDiv from '@/components/MJTileDiv'

const ORDERING: PlayerIndex[][] = [
  ['0', '3', '1', '2'],
  ['3', '2', '0', '1'],
  ['2', '1', '3', '0'],
  ['1', '0', '2', '3'],
]

const PlayersGridView = ({
  players,
  currentRound,
  onAction,
}: PlayersViewProps) => {
  const [orderIndex, setOrderIndex] = useState<number>(0)
  const order = useMemo(() => ORDERING[orderIndex], [orderIndex])

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

  const handleClickRotate = useCallback(() => {
    setOrderIndex((prev) => (prev + 1) % 4)
  }, [])

  return (
    <div>
      <div className="text-center mb-4">
        <MJUIButton size="small" onClick={handleClickRotate}>
          逆時針旋轉 <i className="bi bi-arrow-counterclockwise"></i>
        </MJUIButton>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <table className="w-full border border-black">
          <tbody>
            <tr>
              <td
                className="p-1 space-x-1 text-white"
                style={{ background: players[order[0]].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[order[0]].logoUrl as string}
                  alt={players[order[0]].primaryName}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[0]].propicUrl as string}
                  alt={players[order[0]].primaryName}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[0]].secondaryName}</p>
                  <p>{players[order[0]].primaryName}</p>
                </div>
              </td>
              <td
                className="p-1 space-x-1 text-white text-4xl text-right pr-2"
                style={{ background: players[order[0]].color }}
              >
                {currentRound.playerResults[order[0]].afterScore}
              </td>
            </tr>
            <tr>
              <td className="w-1/2 px-2 h-16" colSpan={2}>
                <button
                  className="py-2 text-left block"
                  data-player-index={order[0]}
                  data-action="waitingTile"
                  onClick={handleAction}
                >
                  <span className="mr-2 text-xl">待牌</span>
                  <div className="inline-block space-x-1">
                    {currentRound.playerResults[order[0]].waitingTiles?.map(
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
            </tr>
            <tr>
              <td className="w-full px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pb-4">
                <div>
                  <div
                    className="data-[active='1']:bg-yellow-200"
                    data-active={
                      currentRound.playerResults[order[0]].detail.dora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[0]}
                      data-action="dora-normal-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    寶{currentRound.playerResults[order[0]].detail.dora}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[0]}
                      data-action="dora-normal-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                  <div
                    className="data-[active='1']:bg-red-200"
                    data-active={
                      currentRound.playerResults[order[0]].detail.redDora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[0]}
                      data-action="dora-red-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    赤{currentRound.playerResults[order[0]].detail.redDora ?? 0}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[0]}
                      data-action="dora-red-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap" colSpan={2}>
                <div className=" grid grid-cols-3 gap-2 justify-center">
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-teal-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[0]}
                    data-action="reveal"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[0]].isRevealed
                        ? '1'
                        : '0'
                    }
                    disabled={currentRound.playerResults[order[0]].isRiichi}
                  >
                    副露
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[0]}
                    data-action="ron-self"
                    onClick={handleAction}
                  >
                    自摸
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[0]}
                    data-action="ron-before"
                    onClick={handleAction}
                  >
                    和上家←
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-red-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[0]}
                    data-action="riichi"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[0]].isRiichi ? '1' : '0'
                    }
                    disabled={currentRound.playerResults[order[0]].isRevealed}
                  >
                    立直
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[0]}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    和下家↑
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[0]}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    和對家↖
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border border-black">
          <tbody>
            <tr>
              <td
                className="p-1 space-x-1 text-white"
                style={{ background: players[order[1]].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[order[1]].logoUrl as string}
                  alt={players[order[1]].secondaryName}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[1]].propicUrl as string}
                  alt={players[order[1]].primaryName}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[1]].secondaryName}</p>
                  <p>{players[order[1]].primaryName}</p>
                </div>
              </td>
              <td
                className="p-1 space-x-1 text-white text-4xl text-right pr-2"
                style={{ background: players[order[1]].color }}
              >
                {currentRound.playerResults[order[1]].afterScore}
              </td>
            </tr>
            <tr>
              <td className="w-1/2 px-2 h-16" colSpan={2}>
                <button
                  className="py-2 text-left block"
                  data-player-index={order[1]}
                  data-action="waitingTile"
                  onClick={handleAction}
                >
                  <span className="mr-2 text-xl">待牌</span>
                  <div className="inline-block space-x-1">
                    {currentRound.playerResults[order[1]].waitingTiles?.map(
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
            </tr>
            <tr>
              <td className="w-full px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pb-4">
                <div>
                  <div
                    className="data-[active='1']:bg-yellow-200"
                    data-active={
                      currentRound.playerResults[order[1]].detail.dora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[1]}
                      data-action="dora-normal-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    寶{currentRound.playerResults[order[1]].detail.dora}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[1]}
                      data-action="dora-normal-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                  <div
                    className="data-[active='1']:bg-red-200"
                    data-active={
                      currentRound.playerResults[order[1]].detail.redDora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[1]}
                      data-action="dora-red-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    赤{currentRound.playerResults[order[1]].detail.redDora ?? 0}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[1]}
                      data-action="dora-red-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap" colSpan={2}>
                <div className=" grid grid-cols-3 gap-2 justify-center">
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[1]}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    →和下家
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[1]}
                    data-action="ron-self"
                    onClick={handleAction}
                  >
                    自摸
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-teal-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[1]}
                    data-action="reveal"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[1]].isRevealed
                        ? '1'
                        : '0'
                    }
                    disabled={currentRound.playerResults[order[1]].isRiichi}
                  >
                    副露
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[1]}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    ↗和對家
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[1]}
                    data-action="ron-before"
                    onClick={handleAction}
                  >
                    ↑和上家
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-red-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[1]}
                    data-action="riichi"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[1]].isRiichi ? '1' : '0'
                    }
                    disabled={currentRound.playerResults[order[1]].isRevealed}
                  >
                    立直
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border border-black">
          <tbody>
            <tr>
              <td className="whitespace-nowrap" colSpan={2}>
                <div className=" grid grid-cols-3 gap-2 justify-center">
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-red-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[2]}
                    data-action="riichi"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[2]].isRiichi ? '1' : '0'
                    }
                    disabled={currentRound.playerResults[order[2]].isRevealed}
                  >
                    立直
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[2]}
                    data-action="ron-before"
                    onClick={handleAction}
                  >
                    和上家↓
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[2]}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    和對家↙
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-teal-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[2]}
                    data-action="reveal"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[2]].isRevealed
                        ? '1'
                        : '0'
                    }
                    disabled={currentRound.playerResults[order[2]].isRiichi}
                  >
                    副露
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[2]}
                    data-action="ron-self"
                    onClick={handleAction}
                  >
                    自摸
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[2]}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    和下家←
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-full px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pt-4">
                <div>
                  <div
                    className="data-[active='1']:bg-yellow-200"
                    data-active={
                      currentRound.playerResults[order[2]].detail.dora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[2]}
                      data-action="dora-normal-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    寶{currentRound.playerResults[order[2]].detail.dora}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[2]}
                      data-action="dora-normal-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                  <div
                    className="data-[active='1']:bg-red-200"
                    data-active={
                      currentRound.playerResults[order[2]].detail.redDora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[2]}
                      data-action="dora-red-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    赤{currentRound.playerResults[order[2]].detail.redDora ?? 0}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[2]}
                      data-action="dora-red-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-1/2 px-2 h-16" colSpan={2}>
                <button
                  className="py-2 text-left block"
                  data-player-index={order[2]}
                  data-action="waitingTile"
                  onClick={handleAction}
                >
                  <span className="mr-2 text-xl">待牌</span>
                  <div className="inline-block space-x-1">
                    {currentRound.playerResults[order[2]].waitingTiles?.map(
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
            </tr>
            <tr>
              <td
                className="p-1 space-x-1 text-white"
                style={{ background: players[order[2]].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[order[2]].logoUrl as string}
                  alt={players[order[2]].secondaryName}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[2]].propicUrl as string}
                  alt={players[order[2]].primaryName}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[2]].secondaryName}</p>
                  <p>{players[order[2]].primaryName}</p>
                </div>
              </td>
              <td
                className="p-1 space-x-1 text-white text-4xl text-right pr-2"
                style={{ background: players[order[2]].color }}
              >
                {currentRound.playerResults[order[2]].afterScore}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border border-black">
          <tbody>
            <tr>
              <td className="whitespace-nowrap" colSpan={2}>
                <div className=" grid grid-cols-3 gap-2 justify-center">
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[3]}
                    data-action="ron-opposite"
                    onClick={handleAction}
                  >
                    ↘和對家
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[3]}
                    data-action="ron-after"
                    onClick={handleAction}
                  >
                    ↓和下家
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-red-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[3]}
                    data-action="riichi"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[3]].isRiichi ? '1' : '0'
                    }
                    disabled={currentRound.playerResults[order[3]].isRevealed}
                  >
                    立直
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[3]}
                    data-action="ron-before"
                    onClick={handleAction}
                  >
                    →和上家
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl"
                    data-player-index={order[3]}
                    data-action="ron-self"
                    onClick={handleAction}
                  >
                    自摸
                  </button>
                  <button
                    className="px-1 py-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4 disabled:opacity-20 disabled:cursor-not-allowed data-[active='1']:bg-teal-800 data-[active='1']:text-yellow-300"
                    data-player-index={order[3]}
                    data-action="reveal"
                    onClick={handleAction}
                    data-active={
                      currentRound.playerResults[order[3]].isRevealed
                        ? '1'
                        : '0'
                    }
                    disabled={currentRound.playerResults[order[3]].isRiichi}
                  >
                    副露
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-full px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pt-4">
                <div>
                  <div
                    className="data-[active='1']:bg-yellow-200"
                    data-active={
                      currentRound.playerResults[order[3]].detail.dora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[3]}
                      data-action="dora-normal-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    寶{currentRound.playerResults[order[3]].detail.dora}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[3]}
                      data-action="dora-normal-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                  <div
                    className="data-[active='1']:bg-red-200"
                    data-active={
                      currentRound.playerResults[order[3]].detail.redDora > 0
                        ? '1'
                        : '0'
                    }
                  >
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[3]}
                      data-action="dora-red-minus"
                      onClick={handleAction}
                    >
                      -
                    </button>
                    赤{currentRound.playerResults[order[3]].detail.redDora}
                    <button
                      className="px-2 text-lg leading-0"
                      data-player-index={order[3]}
                      data-action="dora-red-plus"
                      onClick={handleAction}
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-1/2 px-2 h-16" colSpan={2}>
                <button
                  className="py-2 text-left block"
                  data-player-index={order[3]}
                  data-action="waitingTile"
                  onClick={handleAction}
                >
                  <span className="mr-2 text-xl">待牌</span>
                  <div className="inline-block space-x-1">
                    {currentRound.playerResults[order[3]].waitingTiles?.map(
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
            </tr>
            <tr>
              <td
                className="p-1 space-x-1 text-white"
                style={{ background: players[order[3]].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[order[3]].logoUrl as string}
                  alt={players[order[3]].secondaryName}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[3]].propicUrl as string}
                  alt={players[order[3]].primaryName}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[3]].secondaryName}</p>
                  <p>{players[order[3]].primaryName}</p>
                </div>
              </td>
              <td
                className="p-1 space-x-1 text-white text-4xl text-right pr-2"
                style={{ background: players[order[3]].color }}
              >
                {currentRound.playerResults[order[3]].afterScore}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PlayersGridView
