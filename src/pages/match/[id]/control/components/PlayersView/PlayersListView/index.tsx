import { PlayerIndex } from '@/models'
import { PlayersViewProps } from '..'
import React from 'react'

const PlayersListView = ({ players, currentRound }: PlayersViewProps) => {
  return (
    <div className="space-y-2">
      {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
        <table className="w-full border border-black" key={index}>
          <tbody>
            <tr>
              <td
                className="p-1 space-x-1 text-white w-64"
                style={{ background: players[index].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[index].teamPicUrl as string}
                  alt={players[index].title}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[index].proPicUrl as string}
                  alt={players[index].name}
                />
                <div className="inline-block align-middle">
                  <p>{players[index].title}</p>
                  <p>{players[index].name}</p>
                </div>
              </td>
              <td className="px-2" colSpan={2}>
                待牌
              </td>
              <td className="whitespace-nowrap w-0 space-y-1 pr-1" rowSpan={2}>
                <div className="space-x-1">
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    副露
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和上家
                  </button>
                </div>
                <div className="space-x-1">
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    立直
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和對家
                  </button>
                </div>
                <div className="space-x-1">
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    自摸
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
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
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4">
                <div>
                  <div>
                    <button className="px-2 text-lg leading-0">-</button>寶0
                    <button className="px-2 text-lg leading-0">+</button>
                  </div>
                  <div>
                    <button className="px-2 text-lg leading-0">-</button>赤0
                    <button className="px-2 text-lg leading-0">+</button>
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
