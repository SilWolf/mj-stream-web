import React from 'react'
import MJMatchRoundAndSubSpan from './components/MJMatchRoundAndSubSpan'
import MJPlayerCardDiv from './components/MJPlayerCardDiv'
import MJTileDiv from './components/MJTileDiv'

function App() {
  return (
    <div className="w-[1920px] h-[1080px] mx-auto flex flex-col items-stretch p-2">
      <div className="flex flex-row items-stretch gap-x-1 text-white">
        <div className="border-[6px] rounded px-1 border-current bg-black bg-opacity-20">
          <MJMatchRoundAndSubSpan>1.1</MJMatchRoundAndSubSpan>
        </div>
        <div className="rounded bg-black bg-opacity-60 pl-0.5 pr-1 flex items-center gap-x-0.5">
          <div className="text-[20px]" style={{ writingMode: 'vertical-rl' }}>
            懸賞
          </div>
          <div className="h-[55%] w-[2px] bg-white bg-opacity-50" />
          <div>
            <MJTileDiv className="w-[48px]">2m</MJTileDiv>
          </div>
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex-1 text-current text-[40px] flex items-center justify-center">
        <div>
          <p>1. 打開OBS</p>
          <p>
            2. 來源 {'->'} + {'->'} 瀏覽器，然後照下面設定
          </p>
          <p>
            - 網址 = 此頁的網址 <strong>{window.location.href}</strong>
            <br />- 寬度 = 1920, 高度 = 1080
            <br /> - 自訂CSS ={' '}
            {
              'body { background-color: rgba(0, 0, 0, 0); color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }'
            }
            <br />
            其餘默認即可。
          </p>
          <p>4. 確定</p>
        </div>
      </div>
      <div className="flex flex-row items-end justify-center gap-x-2 text-white">
        <MJPlayerCardDiv
          name="A"
          score={25000}
          className="!bg-blue-400 !bg-opacity-60"
        />
        <MJPlayerCardDiv
          name="B"
          score={25000}
          className="!bg-red-400 !bg-opacity-60"
        />
        <MJPlayerCardDiv
          name="C"
          score={25000}
          className="!bg-green-400 !bg-opacity-60"
        />
        <MJPlayerCardDiv
          name="D"
          score={25000}
          className="!bg-yellow-400 !bg-opacity-60"
        />
      </div>
    </div>
  )
}

export default App
