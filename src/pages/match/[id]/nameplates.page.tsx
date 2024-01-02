import { TeamPlayerDTO, apiGetMatchById } from '@/helpers/sanity.helper'
import { getLightColorOfColor } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'wouter'

const MatchNameplate = ({ teamPlayer }: { teamPlayer: TeamPlayerDTO }) => {
  const lightenedColor = useMemo(
    () => getLightColorOfColor(teamPlayer.color),
    [teamPlayer.color]
  )

  return (
    <div className="relative overflow-hidden">
      <table className="w-full">
        <tbody>
          <tr style={{ background: teamPlayer.color }}>
            <td className="w-[8mm] h-[8mm]"></td>
            <td className="w-[2mm] border-r border-white"></td>
            <td></td>
            <td className="w-[2mm] border-l border-white"></td>
            <td className="w-[8mm] h-[8mm]"></td>
          </tr>
          <tr style={{ background: teamPlayer.color }}>
            <td className="h-[2mm] border-b border-white"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="h-[2mm] border-b border-white"></td>
          </tr>
          <tr
            style={{
              background: `linear-gradient(180deg, ${teamPlayer.color}, ${lightenedColor})`,
            }}
          >
            <td></td>
            <td></td>
            <td className="w-[150mm] h-[40mm]"></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ background: lightenedColor }}>
            <td className="h-[2mm] border-t border-white"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="h-[2mm] border-t border-white"></td>
          </tr>
          <tr style={{ background: lightenedColor }}>
            <td className="w-[8mm] h-[8mm]"></td>
            <td className="w-[2mm] border-r border-white"></td>
            <td></td>
            <td className="w-[2mm] border-l border-white"></td>
            <td className="w-[8mm] h-[8mm]"></td>
          </tr>
        </tbody>
      </table>
      <div
        className="absolute left-[0] top-[2.5mm] w-[55mm] h-[55mm] bg-contain opacity-50"
        style={{
          backgroundImage: `url(${
            teamPlayer.teamLogoImageUrl + '?w=500&h=500'
          })`,
        }}
      ></div>
      <div className="absolute top-[10mm] bottom-[10mm] left-[25mm] right-[12mm] flex flex-col items-center justify-center">
        <p
          className="text-[13mm] text-white leading-none font-semibold mb-[3mm]"
          style={{
            textShadow: '0px 0px 3px #333333B0, 0px 0px 6px #333333B0',
          }}
        >
          {teamPlayer.playerName}
        </p>
        <p
          className="text-[13mm] text-white leading-none font-semibold"
          style={{
            textShadow: '0px 0px 3px #333333B0, 0px 0px 6px #333333B0',
          }}
        >
          {teamPlayer.playerNickname}
        </p>
      </div>
    </div>
  )
}

const MatchNameplatesPage = () => {
  const { matchId } = useParams() as { matchId: string }

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
      <div className="w-[170mm] h-[60mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerEast} />
      </div>
      <div className="w-[170mm] h-[60mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerSouth} />
      </div>
      <div className="w-[170mm] h-[60mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerWest} />
      </div>
      <div className="w-[170mm] h-[60mm] mx-auto">
        <MatchNameplate teamPlayer={dbMatch?.playerNorth} />
      </div>
    </div>
  )
}

export default MatchNameplatesPage
