import MJUIButton from '@/components/MJUI/MJUIButton'
import React from 'react'

function IndexPage() {
  return (
    <div className="container mx-auto max-w-screen-sm ">
      <div className="h-screen flex flex-col py-16 gap-y-12">
        <div className="shrink-0">
          <h1 className="text-5xl text-center">日麻比賽直播系統 (牌藝攻防)</h1>
        </div>
        <div className="text-center">
          <img
            src="/images/master-logo.jpeg"
            className="w-48 mx-auto"
            alt="HKMSCA"
          />
        </div>
        <div className="flex-1 bg-gray-100 bg-opacity-50 rounded p-8 min-h-0 overflow-scroll">
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
        </div>
        <div className="shrink-0 space-y-4">
          <div>
            <a href="/create-match">
              <MJUIButton className="w-full" size="xlarge">
                開新對局
              </MJUIButton>
            </a>
          </div>
          <div>
            <div className="text-center">
              {/* <a href="/players">
                <MJUIButton color="secondary" size="large">
                  玩家列表
                </MJUIButton>
              </a> */}
            </div>
          </div>
          <div className="flex gap-x-4">
            {/* <div className="flex-1">
              <button
                type="button"
                className="w-full bg-gray-200 text-black text-4xl p-4 rounded-lg"
              >
                對局列表
              </button>
            </div> */}
            <div className="flex-1">
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
            </div>
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
