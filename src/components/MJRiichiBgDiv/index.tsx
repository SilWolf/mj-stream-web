import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

function MJRiichiBgDiv(props: Props) {
  return (
    <div {...props}>
      <div className="relative w-full h-full bg-[#d1b571] overflow-hidden">
        <div className="origin-bottom w-[200%] h-[100%] bg-[#d1291d] animate-[riichi_8s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}

export default MJRiichiBgDiv
