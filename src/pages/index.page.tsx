import React from 'react'

function IndexPage() {
  return (
    <div className="container mx-auto max-w-screen-sm ">
      <div className="h-screen flex flex-col py-16">
        <div className="flex-1">
          <h1 className="text-5xl text-center">日麻比賽直播系統</h1>
        </div>
        <div className="shrink-0 space-y-4">
          <div>
            <a
              href="/create-match"
              className="block text-center w-full bg-blue-600 text-white text-4xl p-4 rounded-lg"
            >
              開新對局
            </a>
          </div>
          <div className="flex gap-x-4">
            <div className="flex-1">
              <button
                type="button"
                className="w-full bg-gray-200 text-black text-4xl p-4 rounded-lg"
              >
                對局列表
              </button>
            </div>
            <div className="flex-1">
              <a
                href="/players"
                className="block text-center w-full bg-gray-200 text-black text-4xl p-4 rounded-lg"
              >
                玩家列表
              </a>
            </div>
            <div className="flex-1">
              <button
                type="button"
                className="w-full bg-gray-200 text-black text-4xl p-4 rounded-lg"
              >
                使用說明
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
