import React from 'react'
import MJMatchRoundAndSubSpan from './components/MJMatchRoundAndSubSpan'

function App() {
  return (
    <div className="w-[1920px] h-[1080px] mx-auto text-white flex flex-col items-stretch p-4">
      <div className="flex flex-row items-start">
        <div>
          <MJMatchRoundAndSubSpan>1.1</MJMatchRoundAndSubSpan>
        </div>
        <div className="flex-1" />
        <div>LOGO</div>
      </div>
      <div className="flex-1" />
      <div className="flex flex-row items-end justify-center gap-x-4">
        <div>A</div>
        <div>B</div>
        <div>C</div>
        <div>D</div>
      </div>
    </div>
  )
}

export default App
