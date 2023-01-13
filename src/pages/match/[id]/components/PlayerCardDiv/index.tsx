/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  propicSrc?: string
  name: string
  score: number
}

export default function MJPlayerCardDiv({
  propicSrc,
  name,
  score,
  className,
  ...props
}: Props) {
  return (
    <div
      className={`bg-white bg-opacity-60 rounded-lg pr-4 ${className}`}
      {...props}
    >
      <div className="flex items-stretch">
        <div className="w-[6rem]">
          {propicSrc && <img src={propicSrc} alt={name} />}
        </div>
        <div className="flex-1 flex flex-col items-end w-[15rem] py-2">
          <div className="text-[2rem] leading-[1]">{name}</div>
          <div className="flex-1 text-[4rem] leading-[1]">{score}</div>
        </div>
      </div>
    </div>
  )
}

MJPlayerCardDiv.defaultProps = {
  propicSrc: '',
}
