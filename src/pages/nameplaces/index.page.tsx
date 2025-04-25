import { getRegularTeamsWithPlayers } from '@/helpers/sanity.helper'
import { Player, Team } from '@/models'
import { getLightColorOfColor } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { apiGetTournamentById } from '../v2/services/tournament.service'
import { V2TournamentTeam } from '../v2/models/V2Tournament.model'
import { V2MatchPlayer } from '../v2/models/V2Match.model'

const MatchNameplateNarrow = ({
  team,
  player,
}: {
  team: Omit<Team, 'players'>
  player: Player
}) => {
  const lightenedColor = useMemo(
    () => getLightColorOfColor(team.color),
    [team.color]
  )

  return (
    <div className="relative overflow-hidden">
      <table className="w-full">
        <tbody>
          <tr style={{ background: team.color }}>
            <td className="w-[8mm] h-[8mm]"></td>
            <td className="w-[2mm] border-r border-white"></td>
            <td></td>
            <td className="w-[2mm] border-l border-white"></td>
            <td className="w-[8mm] h-[8mm]"></td>
          </tr>
          <tr style={{ background: team.color }}>
            <td className="h-[2mm] border-b border-white"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="h-[2mm] border-b border-white"></td>
          </tr>
          <tr
            style={{
              background: `linear-gradient(180deg, ${team.color}, ${lightenedColor})`,
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
        className="absolute left-0 top-[2.5mm] w-[55mm] h-[55mm] bg-contain opacity-50"
        style={{
          backgroundImage: `url(${team.squareLogoImage + '?w=500&h=500'})`,
        }}
      ></div>
      <div className="absolute top-[10mm] bottom-[10mm] left-[25mm] right-[12mm] flex flex-col items-center justify-center">
        <p
          className="text-[13mm] text-white leading-none font-semibold mb-[3mm] whitespace-nowrap scale-x-[.85]"
          style={{
            textShadow: '0px 0px 3px #333333B0, 0px 0px 6px #333333B0',
          }}
        >
          {player.name}
        </p>
        <p
          className="text-[13mm] text-white leading-none font-semibold"
          style={{
            textShadow: '0px 0px 3px #333333B0, 0px 0px 6px #333333B0',
          }}
        >
          {player.nickname}
        </p>
      </div>
    </div>
  )
}

const MatchNameplate = ({ player }: { player: V2MatchPlayer }) => {
  const lightenedColor = useMemo(
    () => getLightColorOfColor(player.color.primary),
    [player.color]
  )

  return (
    <div className="relative overflow-hidden">
      <table className="w-full">
        <tbody>
          <tr style={{ background: player.color.primary }}>
            <td className="w-[8mm] h-[8mm]"></td>
            <td className="w-[2mm] border-r border-white"></td>
            <td></td>
            <td className="w-[2mm] border-l border-white"></td>
            <td className="w-[8mm] h-[8mm]"></td>
          </tr>
          <tr style={{ background: player.color.primary }}>
            <td className="h-[2mm] border-b border-white"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="h-[2mm] border-b border-white"></td>
          </tr>
          <tr
            style={{
              background: `linear-gradient(180deg, ${player.color.primary}, ${lightenedColor})`,
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
        className="absolute left-0 top-[2.5mm] w-[55mm] h-[55mm] bg-contain opacity-50"
        style={{
          backgroundImage: `url(${player.image.logo?.default.url})`,
        }}
      ></div>
      <div className="absolute top-[10mm] bottom-[10mm] left-[25mm] right-[12mm] flex flex-col items-center justify-center">
        <p
          className="text-[18mm] text-white leading-none font-semibold mb-[3mm] whitespace-nowrap"
          style={{
            textShadow: '0px 0px 3px #333333B0, 0px 0px 6px #333333B0',
          }}
        >
          {player.name.display.primary}
        </p>
        <p
          className="text-[13mm] text-white leading-none font-semibold"
          style={{
            textShadow: '0px 0px 3px #333333B0, 0px 0px 6px #333333B0',
          }}
        >
          {/* {player.nickname} */}
        </p>
      </div>
    </div>
  )
}

const MatchNameplatesPage = () => {
  const { data } = useQuery({
    queryKey: ['tournament-teams-and-player'],
    queryFn: () => apiGetTournamentById('15e152e2-33bb-495f-ac73-efeba15965f2'),
  })

  if (!data?.teams) {
    return <></>
  }

  const playersPerFour = Object.values(
    Object.groupBy(
      data.teams.map(({ players }) => players).flat(),
      (_, index) => Math.floor(index / 4)
    )
  )

  return (
    <>
      {playersPerFour.map((players, index) => (
        <div
          key={index}
          className="print:w-[210mm] print:h-[297mm] overflow-hidden flex flex-col items-center justify-center"
        >
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
          {players.map((player) => (
            <div key={player.id} className="w-[170mm] h-[60mm] mx-auto">
              <MatchNameplate player={player} />
            </div>
          ))}
        </div>
      ))}
    </>
  )

  // return (
  //   <>
  //     <div className="print:w-[210mm] print:h-[297mm] overflow-hidden content-center">
  //       <div className="w-[170mm] mx-auto mb-8 print:hidden">
  //         <p>右鍵「列印」，設定如下：</p>
  //         <ul>
  //           <li>
  //             紙張大小：<strong>A4</strong>
  //           </li>
  //           <li>
  //             邊界：<strong>無邊界</strong>
  //           </li>
  //           <li>
  //             選項：<strong>打勾「背景圖片」</strong>
  //           </li>
  //         </ul>
  //       </div>
  //       {[
  //         {
  //           team: {
  //             squareLogoImage:
  //               'https://cdn.sanity.io/images/0a9a4r26/production/2fb6e93a5451ed5df221cd98219735d1ae8f1965-2000x2000.png',
  //             color: '#FFCC00',
  //             introduction:
  //               '「Bad Beat」以高惡手率聞名，但總是能在最關鍵時刻逆轉局勢。他們的策略充滿了冒險和驚喜，讓對手猜不透下一步。',
  //             _id: 'fd8f1746-2d30-40d0-bd03-2e11769a0a4f',
  //             slug: 'bad-beat',
  //             name: '壞拍子',
  //             secondaryName: 'Bad Beat',
  //             thirdName: null,
  //             preferredName: null,
  //           },
  //           player: {
  //             introduction: 'MVPC，強項為四逆一，弱項為過膝襪',
  //             _id: '11da7b76-d421-44b9-a6d8-90c1c33ef54f',
  //             name: 'CHAN, Hang Chun Philip',
  //             nickname: 'PC',
  //             portraitImage:
  //               'https://cdn.sanity.io/images/0a9a4r26/production/6aef7d732b55014ee53ffc0177532355f1ce4a9d-360x500.png',
  //             designation: null,
  //           },
  //         },
  //         {
  //           team: {
  //             secondaryName: 'BJS',
  //             thirdName: null,
  //             preferredName: null,
  //             squareLogoImage:
  //               'https://cdn.sanity.io/images/0a9a4r26/production/3e7bc270736dab70cbe47756ce768527febef103-1600x1600.png',
  //             color: '#DCBEFF',
  //             introduction:
  //               '放銃 — 是日本麻雀中不可避免的事情。但我們四位少年（？），一邊以防銃為目標，一邊以超攻擊型風格砍獲分數，劍指決賽。',
  //             _id: 'R4zj9VDraGU9JFViHQyANL',
  //             slug: 'bjs',
  //             name: '防銃少年團',
  //           },
  //           player: {
  //             portraitImage:
  //               'https://cdn.sanity.io/images/0a9a4r26/production/eb6a9f78951ead7b04a83919a0ce850c3d80e196-360x500.png',
  //             designation: null,
  //             introduction:
  //               '穩健型偏90度選手（直角型？） 上年唯一一個食出三倍滿嘅選手，今年希望延續彪炳戰績，幫隊伍爭取決賽席位^^',
  //             _id: 'a455b251-3898-4a2d-8d99-218221912d78',
  //             name: 'LAU, Wing Chung Ivan',
  //             nickname: 'Ivan',
  //           },
  //         },
  //         {
  //           team: {
  //             secondaryName: 'BJS',
  //             thirdName: null,
  //             preferredName: null,
  //             squareLogoImage:
  //               'https://cdn.sanity.io/images/0a9a4r26/production/3e7bc270736dab70cbe47756ce768527febef103-1600x1600.png',
  //             color: '#DCBEFF',
  //             introduction:
  //               '放銃 — 是日本麻雀中不可避免的事情。但我們四位少年（？），一邊以防銃為目標，一邊以超攻擊型風格砍獲分數，劍指決賽。',
  //             _id: 'R4zj9VDraGU9JFViHQyANL',
  //             slug: 'bjs',
  //             name: '防銃少年團',
  //           },
  //           player: {
  //             _id: 'y6qAFx3KEt65PvSAHG2k5A',
  //             name: 'LAU, Wing Him Ernest',
  //             nickname: 'Ernest',
  //             portraitImage: null,
  //             designation: null,
  //             introduction:
  //               '立直型選手，一發自摸 NICE！但最愛純全三色，輕鬆滿貫最開心。\n前團結Gang Forwards成員，本年度與弟弟 Ivan 組隊再出發。',
  //           },
  //         },
  //       ].map(({ team, player }) => (
  //         <div key={player._id} className="w-[170mm] h-[60mm] mx-auto">
  //           <MatchNameplateNarrow team={team} player={player} />
  //         </div>
  //       ))}

  //       <div className="w-[170mm] h-[60mm] mx-auto">
  //         <MatchNameplate
  //           team={{
  //             thirdName: null,
  //             preferredName: null,
  //             squareLogoImage:
  //               'https://cdn.sanity.io/images/0a9a4r26/production/ade970e6fe1e4ec37b37da08726cba7ef8665c03-1960x1960.png',
  //             color: '#8A2B2B',
  //             introduction:
  //               '雀療為一種透過與雀互動來促進生理健康的療法。雀的活潑行為和可愛外形能帶來愉悅，幫助舒壓、放鬆心情。',
  //             _id: 'Qw0TwPQaQ8aBM3BSUH00Fx',
  //             slug: 'chirppyland',
  //             name: '雀仔療養院',
  //             secondaryName: 'Chirppyland',
  //           }}
  //           player={{
  //             _id: 'R4zj9VDraGU9JFViHsKp1t',
  //             name: 'LEE, Chun Hong',
  //             nickname: 'InSomnia',
  //             portraitImage: null,
  //             designation: null,
  //             introduction:
  //               '日麻雀齡十年，比賽型選手。自發組隊參加比賽，當初其中一位院友帶我入院。',
  //           }}
  //         />
  //       </div>
  //     </div>
  //   </>
  // )
}

export default MatchNameplatesPage
