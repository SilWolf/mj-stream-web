import {
  DB_TeamPlayer,
  apiGetMatchById,
  convertDbTeamPlayerToPlayer,
} from '@/helpers/sanity.helper'
import { getLightColorOfColor } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'wouter'

const MatchNameplate = ({ teamPlayer }: { teamPlayer: DB_TeamPlayer }) => {
  const player = useMemo(
    () => convertDbTeamPlayerToPlayer(teamPlayer),
    [teamPlayer]
  )

  const lightenedColor = useMemo(
    () => getLightColorOfColor(player.color ?? '#000000'),
    [player.color]
  )

  return (
    <div className="relative overflow-hidden">
      <table className="w-full">
        <tbody>
          <tr style={{ background: player.color }}>
            <td className="w-[8mm] h-[8mm]"></td>
            <td className="w-[2mm] border-r border-neutral-500"></td>
            <td></td>
            <td className="w-[2mm] border-l border-neutral-500"></td>
            <td className="w-[8mm] h-[8mm]"></td>
          </tr>
          <tr style={{ background: player.color }}>
            <td className="h-[2mm] border-b border-neutral-500"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="h-[2mm] border-b border-neutral-500"></td>
          </tr>
          <tr
            style={{
              background: `linear-gradient(180deg, ${player.color}, ${lightenedColor})`,
            }}
          >
            <td></td>
            <td></td>
            <td className="w-[150mm] h-[30mm]"></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ background: lightenedColor }}>
            <td className="h-[2mm] border-t border-neutral-500"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="h-[2mm] border-t border-neutral-500"></td>
          </tr>
          <tr style={{ background: lightenedColor }}>
            <td className="w-[8mm] h-[8mm]"></td>
            <td className="w-[2mm] border-r border-neutral-500"></td>
            <td></td>
            <td className="w-[2mm] border-l border-neutral-500"></td>
            <td className="w-[8mm] h-[8mm]"></td>
          </tr>
        </tbody>
      </table>
      <div
        className="absolute left-[5mm] -top-[4mm] w-[60mm] h-[60mm] bg-contain -rotate-12 opacity-5"
        style={{
          backgroundImage: `url(${player.largeTeamPicUrl})`,
        }}
      ></div>
      <div
        className="absolute left-[15mm] top-[4mm] w-[40mm] h-[40mm] bg-contain -rotate-12"
        style={{
          backgroundImage: `url(${player.largeTeamPicUrl})`,
        }}
      ></div>
      <div className="absolute inset-6 left-[60mm] right-[15mm] flex flex-col items-center justify-center">
        <p
          className="text-[6mm] text-white leading-none mb-1"
          style={{
            textShadow: '0px 0px 4px #333333',
          }}
        >
          {player.title}
        </p>
        <p
          className="text-[12mm] text-white leading-none"
          style={{
            textShadow: '0px 0px 4px #333333',
          }}
        >
          {player.name}
        </p>
      </div>
    </div>
  )
}

const MatchNameplatesPage = () => {
  const { matchId } = useParams() as { matchId: string }
  console.log(matchId)

  const { data: dbMatch } = useQuery({
    queryKey: ['matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchById(queryKey[1]),
    enabled: !!matchId,
  })

  if (!dbMatch) {
    return <></>
  }

  return (
    <div className="pt-16">
      <div className="w-[170mm] mx-auto mb-8 print:hidden">
        <p>右鍵「列印」，設定如下：</p>
        <ul>
          <li>
            紙張大小：<strong>A4</strong>
          </li>
          <li>
            邊界：<strong>無邊界</strong>
          </li>
          <li>
            選項：<strong>打勾「背景圖片」</strong>
          </li>
        </ul>
      </div>
      <div className="w-[170mm] h-[50mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerEast} />
      </div>
      <div className="w-[170mm] h-[50mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerSouth} />
      </div>
      <div className="w-[170mm] h-[50mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerWest} />
      </div>
      <div className="w-[170mm] h-[50mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerNorth} />
      </div>
    </div>
  )
}

export default MatchNameplatesPage
