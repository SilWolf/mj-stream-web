/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  propicSrc?: string
  name: string
  score: number
  isEast?: boolean
}

export default function MJPlayerCardDiv({
  propicSrc,
  name,
  score,
  isEast,
  className,
  ...props
}: Props) {
  return (
    <div>
      <div className="relative">
        <div className="w-[6rem] h-[8rem] bg-white bg-opacity-50 absolute bottom-2 left-2 rounded-[.5rem]">
          {propicSrc && <img src={propicSrc} alt={name} />}
        </div>
        <div className="flex flex-col gap-y-2 items-end justify-end">
          <div className="text-[1.5rem] leading-[1] pr-5">{name}</div>
          <div
            className={`bg-white bg-opacity-60 rounded-lg pl-40 pr-4 ${className}`}
            {...props}
          >
            <div className="font-ud flex-1 text-[4rem] leading-[1]">
              {score}
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-2 h-1.5 rounded-full ${isEast && 'bg-red-400'}`} />
    </div>
  )
}

MJPlayerCardDiv.defaultProps = {
  propicSrc: '',
  isEast: false,
}
