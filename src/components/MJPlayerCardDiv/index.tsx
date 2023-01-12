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
      className={`bg-white bg-opacity-60 rounded-lg pr-1 ${className}`}
      {...props}
    >
      <div className="flex items-stretch">
        <div className="w-8">
          {propicSrc && <img src={propicSrc} alt={name} />}
        </div>
        <div className="flex-1 flex flex-col items-end w-14">
          <div className="text-xs">{name}</div>
          <div className="flex-1">{score}</div>
        </div>
      </div>
    </div>
  )
}

MJPlayerCardDiv.defaultProps = {
  propicSrc: '',
}
