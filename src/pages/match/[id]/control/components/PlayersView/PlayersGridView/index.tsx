import { PlayerIndex } from '@/models'
import { PlayersViewProps } from '..'
import React, { useCallback, useMemo, useState } from 'react'
import MJUIButton from '@/components/MJUI/MJUIButton'

const ORDERING: PlayerIndex[][] = [
  ['0', '3', '1', '2'],
  ['3', '2', '0', '1'],
  ['2', '1', '3', '0'],
  ['1', '0', '2', '3'],
]

const PlayersGridView = ({ players, currentRound }: PlayersViewProps) => {
  const [orderIndex, setOrderIndex] = useState<number>(0)
  const order = useMemo(() => ORDERING[orderIndex], [orderIndex])

  const handleClickRotate = useCallback(() => {
    setOrderIndex((prev) => (prev + 1) % 4)
  }, [])

  return (
    <div>
      <div className="text-center mb-4">
        <MJUIButton size="small" onClick={handleClickRotate}>
          逆時針旋轉{' '}
          <span className="material-symbols-outlined text-sm">rotate_left</span>
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
                  src={players[order[0]].teamPicUrl as string}
                  alt={players[order[0]].title}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[0]].proPicUrl as string}
                  alt={players[order[0]].name}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[0]].title}</p>
                  <p>{players[order[0]].name}</p>
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
                待牌
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pb-4">
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
            <tr>
              <td className="whitespace-nowrap" colSpan={2}>
                <div className=" grid grid-cols-3 gap-2 justify-center">
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4">
                    副露
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    自摸
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和上家←
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4">
                    立直
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和下家↑
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
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
                  src={players[order[1]].teamPicUrl as string}
                  alt={players[order[1]].title}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[1]].proPicUrl as string}
                  alt={players[order[1]].name}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[1]].title}</p>
                  <p>{players[order[1]].name}</p>
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
                待牌
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pb-4">
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
            <tr>
              <td className="whitespace-nowrap" colSpan={2}>
                <div className=" grid grid-cols-3 gap-2 justify-center">
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    →和下家
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    自摸
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4">
                    副露
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    ↗和對家
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    ↑和上家
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4">
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
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4">
                    立直
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和上家↓
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和對家↙
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl mr-4">
                    副露
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    自摸
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    和下家←
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pt-4">
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
            <tr>
              <td className="w-1/2 px-2 h-16" colSpan={2}>
                待牌
              </td>
            </tr>
            <tr>
              <td
                className="p-1 space-x-1 text-white"
                style={{ background: players[order[2]].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[order[2]].teamPicUrl as string}
                  alt={players[order[2]].title}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[2]].proPicUrl as string}
                  alt={players[order[2]].name}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[2]].title}</p>
                  <p>{players[order[2]].name}</p>
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
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    ↘和對家
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    ↓和下家
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4">
                    立直
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    →和上家
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl">
                    自摸
                  </button>
                  <button className="px-1 bg-neutral-200 border rounded border-neutral-700 text-xl ml-4">
                    副露
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>役</span>
              </td>
              <td className="w-0 text-right whitespace-nowrap px-4 pt-4">
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
            <tr>
              <td className="w-1/2 px-2 h-16" colSpan={2}>
                待牌
              </td>
            </tr>
            <tr>
              <td
                className="p-1 space-x-1 text-white"
                style={{ background: players[order[3]].color }}
              >
                <img
                  className="w-8 h-8 inline-block"
                  src={players[order[3]].teamPicUrl as string}
                  alt={players[order[3]].title}
                />
                <img
                  className="w-[1.44rem] h-8 inline-block"
                  src={players[order[3]].proPicUrl as string}
                  alt={players[order[3]].name}
                />
                <div className="inline-block align-middle">
                  <p>{players[order[3]].title}</p>
                  <p>{players[order[3]].name}</p>
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
