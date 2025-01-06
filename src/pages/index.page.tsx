import MJUIButton from '@/components/MJUI/MJUIButton'
import { apiGetMatches } from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo } from 'react'
import OBSInstructionDivV2 from './obs/components/OBSInstructionDivV2'
import { getQrCodeImgSrc } from '@/utils/string.util'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import { Player, Team } from '@/models'

const DBTeamPlayerDiv = ({
  team,
  player,
}: {
  team: Team | undefined
  player: Player | undefined
}) => {
  if (!team || !player) {
    return <></>
  }

  const portraitImage = `${player.portraitImage}?w=64&h=64&fit=crop&crop=top`
  const squareLogoImage = `${team.squareLogoImage}?w=64&h=64`
  const designation = player.designation
  const name = player.name
  const color = team.color

  return (
    <div
      className="flex justify-start items-center gap-x-1 border-l-4 pl-2"
      style={{ borderColor: color }}
    >
      <div className="w-8 h-8">
        {squareLogoImage && (
          <img src={squareLogoImage} alt={designation ?? ''} />
        )}
      </div>
      <div className="w-8 h-8">
        {portraitImage && <img src={portraitImage} alt={name ?? ''} />}
      </div>
      <div className="flex-1">
        <p className="font-bold">{name}</p>
        <p className="text-sm text-neutral-600">{player.nickname}</p>
      </div>
    </div>
  )
}

function IndexPage() {
  const { data: matches, refetch: refetchMatches } = useQuery({
    queryKey: ['matches'],
    queryFn: apiGetMatches,
  })

  const { data: obsInfo, set: setObsInfo } =
    useFirebaseDatabaseByKey<string>(`obs/1`)

  const handleClickStartBroadcast = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [setObsInfo]
  )

  const liveMatch = useMemo(() => {
    return matches?.find((match) => match._id === obsInfo?.matchId)
  }, [matches, obsInfo?.matchId])

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
          <div className="grid grid-cols-3 gap-x-4">
            <div className="col-span-2">
              <div className="px-8 py-4 bg-green-300 border-2 border-green-600 text-center space-y-4">
                <p className="text-3xl font-bold text-green-900">OBS設定</p>

                <div className="grid grid-cols-2 gap-x-4">
                  <div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <a
                          href={`${location.origin}/obs/1/scene`}
                          target="_blank"
                          className="block text-black bg-white bg-opacity-40 p-2 rounded hover:text-black"
                        >
                          <span className="text-red-600 font-bold">
                            *01/30新增*
                          </span>
                          <br />
                          多合一場景
                        </a>
                        <a
                          href={`${location.origin}/obs/1/realtime-summary`}
                          target="_blank"
                          className="block text-black bg-white bg-opacity-40 p-2 rounded hover:text-black"
                        >
                          現時數據
                        </a>
                        <a
                          href={`${location.origin}/obs/1/end`}
                          target="_blank"
                          className="text-black bg-white bg-opacity-40 p-2 rounded hover:text-black"
                        >
                          今日賽事已完結
                        </a>
                      </div>

                      <div className="bg-white rounded p-4 space-y-4">
                        <p className="text-center">
                          請在下方表格點擊“直播“來切換賽事
                        </p>

                        {liveMatch && (
                          <div>
                            <div className="grid grid-cols-2 gap-2">
                              <DBTeamPlayerDiv
                                team={liveMatch.playerEastTeam}
                                player={liveMatch.playerEast}
                              />
                              <DBTeamPlayerDiv
                                team={liveMatch.playerSouthTeam}
                                player={liveMatch.playerSouth}
                              />
                              <DBTeamPlayerDiv
                                team={liveMatch.playerWestTeam}
                                player={liveMatch.playerWest}
                              />
                              <DBTeamPlayerDiv
                                team={liveMatch.playerNorthTeam}
                                player={liveMatch.playerNorth}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <p>開始前倒數</p>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <a
                              href={`${location.origin}/obs/1/forecast?m=0`}
                              target="_blank"
                              className="text-black bg-red-800 bg-opacity-50 p-2 rounded hover:text-black"
                            >
                              即將開始
                            </a>
                            <a
                              href={`${location.origin}/obs/1/forecast?m=5`}
                              target="_blank"
                              className="text-black bg-red-800 bg-opacity-50 p-2 rounded hover:text-black"
                            >
                              5分鐘
                            </a>
                            <a
                              href={`${location.origin}/obs/1/forecast?m=10`}
                              target="_blank"
                              className="text-black bg-red-800 bg-opacity-50 p-2 rounded hover:text-black"
                            >
                              10分鐘
                            </a>
                            <a
                              href={`${location.origin}/obs/1/forecast?m=15`}
                              target="_blank"
                              className="text-black bg-red-800 bg-opacity-50 p-2 rounded hover:text-black"
                            >
                              15分鐘
                            </a>
                            <a
                              href={`${location.origin}/obs/1/forecast?m=20`}
                              target="_blank"
                              className="text-black bg-red-800 bg-opacity-50 p-2 rounded hover:text-black"
                            >
                              20分鐘
                            </a>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <a
                            href={`${location.origin}/obs/1/introduction`}
                            target="_blank"
                            className="text-black bg-white bg-opacity-40 p-2 rounded hover:text-black"
                          >
                            賽前介紹
                          </a>
                          <a
                            href={`${location.origin}/obs/1`}
                            target="_blank"
                            className="text-black bg-white bg-opacity-40 p-2 rounded hover:text-black"
                          >
                            直播頁面
                          </a>
                          <a
                            href={`${location.origin}/obs/1/summary`}
                            target="_blank"
                            className="text-black bg-white bg-opacity-40 p-2 rounded hover:text-black"
                          >
                            賽後結果
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-left">
                      <OBSInstructionDivV2 />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div>
              <div className="px-8 py-4 bg-blue-300 border-2 border-blue-600 text-center space-y-4">
                <p className="text-3xl font-bold text-blue-900">
                  主播 + 控制台
                </p>
                <p className="text-2xl">
                  固定的紀錄頁面：
                  <a
                    href={`${location.origin}/obs/1/stat`}
                    target="_blank"
                    className="text-black"
                  >
                    {location.origin}/obs/1/stat
                  </a>
                </p>
                <p className="text-2xl">
                  固定的Overlay頁面：
                  <a
                    href={`${location.origin}/obs/1/stat`}
                    target="_blank"
                    className="text-black"
                  >
                    {location.origin}/obs/1/overlay
                  </a>
                </p>
                <div className="pt-16">
                  <img
                    className="mx-auto block w-64 h-64"
                    src={getQrCodeImgSrc(`${location.origin}/obs/1/stat`)}
                    alt=""
                  />
                </div>
              </div>
            </div> */}
            <div>
              <div className="px-8 py-4 bg-yellow-300 border-2 border-yellow-600 text-center space-y-4">
                <p className="text-3xl font-bold text-yellow-900">
                  主播＋控制台
                </p>
                <p className="text-2xl">
                  分數控制台：
                  <a
                    href={`${location.origin}/obs/1/control`}
                    target="_blank"
                    className="text-black"
                  >
                    {location.origin}/obs/1/control
                  </a>
                </p>
                <div>
                  <img
                    className="mx-auto block w-48 h-48"
                    src={getQrCodeImgSrc(`${location.origin}/obs/1/control`)}
                    alt=""
                  />
                </div>

                <p className="text-2xl">
                  多合一場景控制台：
                  <a
                    href={`${location.origin}/obs/1/scene-control`}
                    target="_blank"
                    className="text-black"
                  >
                    {location.origin}/obs/1/scene-control
                  </a>
                </p>
                <div>
                  <img
                    className="mx-auto block w-48 h-48"
                    src={getQrCodeImgSrc(
                      `${location.origin}/obs/1/scene-control`
                    )}
                    alt=""
                  />
                </div>

                <p className="text-2xl">
                  OBS遙控控制台(要連上牌藝Wifi)
                  <a
                    href={`http://192.168.1.8:88/obs-control`}
                    target="_blank"
                    className="text-black"
                  >
                    http://192.168.1.8:88/obs-control
                  </a>
                </p>
                <div>
                  <img
                    className="mx-auto block w-48 h-48"
                    src={getQrCodeImgSrc(`http://192.168.1.8:88/obs-control`)}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-right mb-2 space-x-2">
              <a href="https://hkmjbs.sanity.studio/" target="_blank">
                <MJUIButton color="secondary">
                  資料庫 <i className="bi bi-box-arrow-up-right"></i>
                </MJUIButton>
              </a>
              <MJUIButton color="secondary" onClick={() => refetchMatches()}>
                <i className="bi bi-arrow-repeat"></i> 刷新
              </MJUIButton>
            </div>
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
                        {match.tournament.name}
                      </p>
                    </th>
                    <td>
                      <DBTeamPlayerDiv
                        team={match.playerEastTeam}
                        player={match.playerEast}
                      />
                    </td>
                    <td>
                      <DBTeamPlayerDiv
                        team={match.playerSouthTeam}
                        player={match.playerSouth}
                      />
                    </td>
                    <td>
                      <DBTeamPlayerDiv
                        team={match.playerWestTeam}
                        player={match.playerWest}
                      />
                    </td>
                    <td>
                      <DBTeamPlayerDiv
                        team={match.playerNorthTeam}
                        player={match.playerNorth}
                      />
                    </td>
                    <td className="space-x-2 text-right">
                      <div className="space-x-2">
                        <a
                          href={`${
                            import.meta.env.VITE_HOMEPAGE_HOST
                          }/api/schedule/${match.startAt.substring(
                            0,
                            10
                          )}/square`}
                          target="_blank"
                        >
                          <i className="bi bi-card-image"></i> 出Post圖
                        </a>

                        <a
                          href={`${
                            import.meta.env.VITE_HOMEPAGE_HOST
                          }/api/schedule/${match.startAt.substring(
                            0,
                            10
                          )}/thumbnail`}
                          target="_blank"
                        >
                          <i className="bi bi-youtube"></i> YT Thumbnail
                        </a>

                        <a
                          href={`/match/${match._id}/nameplates`}
                          target="_blank"
                        >
                          <i className="bi bi-person-badge"></i> 名牌
                        </a>
                      </div>

                      <div className="space-x-2">
                        <a
                          href={`/match/${match._id}/forecast?startAt=${
                            match.name.endsWith('2') ? '21' : '19'
                          }:30`}
                          target="_blank"
                        >
                          <i className="bi bi-bell"></i> 倒數
                        </a>

                        <a
                          href={`/match/${match._id}/introduction`}
                          target="_blank"
                        >
                          <i className="bi bi-person-vcard"></i> 介紹
                        </a>

                        <a href={`/match/${match._id}/summary`} target="_blank">
                          <i className="bi bi-trophy"></i> 結果
                        </a>

                        {match._id === obsInfo?.matchId ? (
                          <span className="bg-red-600 px-2 py-1 rounded text-white">
                            <i className="bi bi-record-circle"></i> LIVE 直播中
                          </span>
                        ) : (
                          <a
                            href={`/match/${match._id}/control`}
                            target="_blank"
                            className="text-red-600"
                          >
                            <i className="bi bi-record-circle"></i> 直播
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="text-center space-x-4"></div>
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
