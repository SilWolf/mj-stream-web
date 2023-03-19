import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

function MJRiichiBgDiv(props: Props) {
  return (
    <div {...props}>
      <div className="relative w-full h-full bg-[#a08a54] overflow-hidden">
        <div className="origin-bottom w-[200%] h-[100%] bg-[#a1241b] animate-[riichi_8s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}

export default MJRiichiBgDiv
