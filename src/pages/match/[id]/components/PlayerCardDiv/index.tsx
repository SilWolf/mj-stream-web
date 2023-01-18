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
        <div className="w-[1.5em] h-full absolute bottom-0 left-0 pl-[0.125em] pb-[0.125em]">
          <div className="w-full h-full bg-white bg-opacity-50 rounded-[0.125em]">
            {propicSrc && <img src={propicSrc} alt={name} />}
          </div>
        </div>
        <div className="flex flex-col gap-y-[0.125em] items-end justify-end">
          <div className="h-[0.25em]" />
          <div className="text-[0.375em] leading-none pr-[0.45em]">{name}</div>
          <div
            className={`w-full text-right bg-white bg-opacity-60 rounded-[0.125em] pl-[2.5em] pr-[0.125em] ${className}`}
            {...props}
          >
            <div className="font-ud flex-1 text-[1em] leading-none">
              {score}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-[0.125em] h-[0.125em] rounded-full ${
          isEast && 'bg-red-400'
        }`}
      />
    </div>
  )
}

MJPlayerCardDiv.defaultProps = {
  propicSrc: '',
  isEast: false,
}
