import MJUIButton from '@/components/MJUI/MJUIButton'
import { DB_TeamPlayer, apiGetMatches } from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo } from 'react'
import OBSInstructionDivV2 from './obs/components/OBSInstructionDivV2'
import { getQrCodeImgSrc } from '@/utils/string.util'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'

const DBTeamPlayerDiv = ({ teamPlayer }: { teamPlayer: DB_TeamPlayer }) => {
  const portraitImage =
    teamPlayer.overridedPortraitImage || teamPlayer.player.portraitImage
      ? `${
          teamPlayer.overridedPortraitImage ?? teamPlayer.player.portraitImage
        }?w=32&h=32`
      : null
  const squareLogoImage = `${teamPlayer.team.squareLogoImage}?w=32&h=32`
  const designation =
    teamPlayer.overridedDesignation ??
    teamPlayer.team.name ??
    teamPlayer.player.designation
  const name = teamPlayer.overridedName ?? teamPlayer.player.name
  const color = teamPlayer.overridedColor ?? teamPlayer.team.color

  return (
    <div
      className="flex justify-start items-center gap-x-1 border-l-4 pl-2"
      style={{ borderColor: color }}
    >
      <div className="w-8 h-8">
        {squareLogoImage && <img src={squareLogoImage} alt={designation} />}
      </div>
      <div className="w-8 h-8">
        {portraitImage && <img src={portraitImage} alt={name} />}
      </div>
      <div className="flex-1">
        <p className="text-sm text-neutral-600">{designation}</p>
        <p className="font-bold">{name}</p>
      </div>
    </div>
  )
}

function IndexPage() {
  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: apiGetMatches,
  })

  const { data: obsInfo, set: setObsInfo } =
    useFirebaseDatabaseByKey<string>(`obs/1`)

  const handleClickStartBroadcast = useCallback((e: React.MouseEvent) => {
    const newMatchId = e.currentTarget.getAttribute('data-id')
    if (!newMatchId) {
      return
    }

    if (
      confirm(
        '請確定上一局對局已經結束才開始新的直播！！\n確定要開始直播新的對局嗎？'
      )
    ) {
      setObsInfo({
        matchId: newMatchId,
      })
    }
  }, [])

  return (
    <div className="container mx-auto">
      <div className="h-screen flex flex-col py-16 gap-y-12">
        <div className="shrink-0">
          <h1 className="text-4xl font-bold text-center">
            <img
              src="/images/master-logo.jpeg"
              className="inline-block w-16"
              alt="HKMSCA"
            />{' '}
            <span>日麻比賽直播系統 (牌藝攻防)</span>
          </h1>
        </div>
        {/* <div className="flex-1 bg-gray-100 bg-opacity-50 rounded p-8 min-h-0 overflow-scroll">
          <ul>
            <li className="font-bold">2022-07-08</li>
            <ul className="list-disc pl-4 mb-4">
              <li>新增「隊伍」</li>
              <li>新增「手動調整分數」</li>
            </ul>

            <li className="font-bold">2022-06-23</li>
            <ul className="list-disc pl-4">
              <li>改善多處介面</li>
              <li>玩家現在可以改顏色</li>
              <li>
                改了字體，已確認是商用免費、可以用在 Youtube
                <ul className="pl-4">
                  <li>
                    芫荽字體{' '}
                    <a href="https://github.com/ButTaiwan/iansui">
                      https://github.com/ButTaiwan/iansui
                    </a>
                  </li>
                  <li>
                    俊羽圓體{' '}
                    <a href="https://github.com/max32002/YuPearl">
                      https://github.com/max32002/YuPearl
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </ul>
        </div> */}
        <div className="shrink-0 space-y-4">
          {/* <div>
            <a href="/create-match">
              <MJUIButton className="w-full" size="xlarge">
                開新對局
              </MJUIButton>
            </a>
          </div> */}
          <div className="grid grid-cols-2 gap-x-4">
            <div className="px-8 py-4 bg-green-300 border-2 border-green-600 text-center space-y-4">
              <p className="text-3xl font-bold text-green-900">OBS設定</p>
              <p className="text-2xl">
                固定的直播頁面：{' '}
                <a
                  href={`${location.origin}/obs/1`}
                  target="_blank"
                  className="text-black"
                >
                  {location.origin}/obs/1
                </a>
              </p>
              <div className="text-left">
                <OBSInstructionDivV2 />
              </div>
            </div>

            <div className="px-8 py-4 bg-yellow-300 border-2 border-yellow-600 text-center space-y-4">
              <p className="text-3xl font-bold text-yellow-900">控制台</p>
              <p className="text-2xl">
                固定的控制台頁面：
                <a
                  href={`${location.origin}/obs/1/control`}
                  target="_blank"
                  className="text-black"
                >
                  {location.origin}/obs/1/control
                </a>
              </p>
              <div className="pt-16">
                <img
                  className="mx-auto block w-64 h-64"
                  src={getQrCodeImgSrc(`${location.origin}/obs/1/control`)}
                  alt=""
                />
              </div>
            </div>
          </div>

          <div>
            {
              <table className="data-table w-full text-left">
                <thead>
                  <tr>
                    <th>對局</th>
                    <th>東</th>
                    <th>南</th>
                    <th>西</th>
                    <th>北</th>
                    <th className="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {matches?.map((match) => (
                    <tr key={match._id}>
                      <th>
                        <p>{match.name}</p>
                        <p className="font-normal text-sm text-neutral-600">
                          {match.rule.name}
                        </p>
                      </th>
                      <td>
                        <DBTeamPlayerDiv teamPlayer={match.playerEast} />
                      </td>
                      <td>
                        <DBTeamPlayerDiv teamPlayer={match.playerSouth} />
                      </td>
                      <td>
                        <DBTeamPlayerDiv teamPlayer={match.playerWest} />
                      </td>
                      <td>
                        <DBTeamPlayerDiv teamPlayer={match.playerNorth} />
                      </td>
                      <td className="space-x-2 text-right">
                        {match._id === obsInfo?.matchId ? (
                          <span className="bg-red-600 px-2 py-1 rounded text-white">
                            LIVE 直播中
                          </span>
                        ) : (
                          <MJUIButton
                            variant="text"
                            onClick={handleClickStartBroadcast}
                            data-id={match._id}
                          >
                            直播此對局
                          </MJUIButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>

          <div>
            <div className="text-center space-x-4">
              <a href="https://hkmjbs.sanity.studio/" target="_blank">
                <MJUIButton color="secondary">
                  資料庫 <i className="bi bi-box-arrow-up-right"></i>
                </MJUIButton>
              </a>
            </div>
          </div>
          <div className="flex gap-x-4">
            {/* <div className="flex-1">
              <a href="/players">
                <MJUIButton className="w-full" color="secondary">
                  玩家列表
                </MJUIButton>
              </a>
            </div> */}
            {/* <div className="flex-1">
              <button
                type="button"
                className="w-full bg-gray-200 text-black text-4xl p-4 rounded-lg"
              >
                對局列表
              </button>
            </div> */}
            {/* <div className="flex-1">
              <a href="/players">
                <MJUIButton className="w-full" color="secondary">
                  玩家列表
                </MJUIButton>
              </a>
            </div>
            <div className="flex-1">
              <a href="/teams">
                <MJUIButton className="w-full" color="secondary">
                  隊伍列表
                </MJUIButton>
              </a>
            </div>
            <div className="flex-1">
              <a href="/matches">
                <MJUIButton className="w-full" color="secondary">
                  對局列表
                </MJUIButton>
              </a>
            </div> */}
            {/* <div className="flex-1">
              <button
                type="button"
                className="w-full bg-gray-200 text-black text-4xl p-4 rounded-lg"
              >
                使用說明
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
