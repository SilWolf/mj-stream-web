import React from 'react'
import MJMatchCounterSpan from './components/MJMatchCounterSpan'
import MJPlayerCardDiv from './components/MJPlayerCardDiv'
import MJTileDiv from './components/MJTileDiv'
import useMatch from './hooks/useMatch'
import BroadcastLayout from './layouts/Broadcast.layout'

function AppOBSInstructionDiv() {
  return (
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
  )
}

type Props = {
  params: { matchId: string }
}

function App({ params: { matchId } }: Props) {
  const { match, matchCurrentRound, matchCurrentRoundDoras } = useMatch(matchId)

  if (!match || !matchCurrentRound) {
    return (
      <BroadcastLayout>
        <div className="text-current">對局讀取失敗。</div>
        <AppOBSInstructionDiv />
      </BroadcastLayout>
    )
  }

  return (
    <BroadcastLayout>
      <div className="flex flex-row items-stretch gap-x-1 text-white">
        <div className="border-[6px] rounded px-1 border-current bg-black bg-opacity-20">
          <MJMatchCounterSpan roundCount={matchCurrentRound.roundCount} />
        </div>
        <div className="rounded bg-black bg-opacity-60 pl-0.5 pr-1 flex items-center gap-x-0.5">
          <div className="text-[20px]" style={{ writingMode: 'vertical-rl' }}>
            懸賞
          </div>
          <div className="h-[55%] w-[2px] bg-white bg-opacity-50" />
          <div>
            {matchCurrentRoundDoras.map((dora) => (
              <MJTileDiv key={dora} className="w-[48px]">
                {dora}
              </MJTileDiv>
            ))}
          </div>
        </div>
        <div className="flex-1" />
      </div>

      <AppOBSInstructionDiv />

      <div className="flex flex-row items-end justify-center gap-x-2 text-white">
        <MJPlayerCardDiv
          name={match.players[0].name}
          score={matchCurrentRound.playerResults[0].beforeScore}
          scoreChanges={matchCurrentRound.playerResults[0].prevScoreChanges}
          className="!bg-blue-400 !bg-opacity-60"
        />
        <MJPlayerCardDiv
          name={match.players[1].name}
          score={matchCurrentRound.playerResults[1].beforeScore}
          scoreChanges={matchCurrentRound.playerResults[1].prevScoreChanges}
          className="!bg-red-400 !bg-opacity-60"
        />
        <MJPlayerCardDiv
          name={match.players[2].name}
          score={matchCurrentRound.playerResults[2].beforeScore}
          scoreChanges={matchCurrentRound.playerResults[2].prevScoreChanges}
          className="!bg-green-400 !bg-opacity-60"
        />
        <MJPlayerCardDiv
          name={match.players[3].name}
          score={matchCurrentRound.playerResults[3].beforeScore}
          scoreChanges={matchCurrentRound.playerResults[3].prevScoreChanges}
          className="!bg-yellow-400 !bg-opacity-60"
        />
      </div>
    </BroadcastLayout>
  )
}

export default App
