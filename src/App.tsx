import React from 'react'
import MJMatchRoundAndSubSpan from './components/MJMatchRoundAndSubSpan'
import MJPlayerCardDiv from './components/MJPlayerCardDiv'

function App() {
  return (
    <div className="w-[1920px] h-[1080px] mx-auto text-white flex flex-col items-stretch p-2">
      <div className="flex flex-row items-start">
        <div>
          <MJMatchRoundAndSubSpan>1.1</MJMatchRoundAndSubSpan>
        </div>
        <div className="flex-1" />
        <div>LOGO</div>
      </div>
      <div className="flex-1" />
      <div className="flex flex-row items-end justify-center gap-x-2">
        <MJPlayerCardDiv name="A" score={25000} className="bg-blue-400" />
        <MJPlayerCardDiv name="B" score={25000} className="bg-red-400" />
        <MJPlayerCardDiv name="C" score={25000} className="bg-green-400" />
        <MJPlayerCardDiv name="D" score={25000} className="bg-yellow-400" />
      </div>
    </div>
  )
}

export default App
