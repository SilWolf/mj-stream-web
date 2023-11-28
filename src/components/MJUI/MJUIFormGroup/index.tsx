import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  label: React.ReactNode
}

function MJUIFormGroup({ children, label, ...divProps }: Props) {
  return (
    <div {...divProps}>
      <label>
        <div className="text-sm text-gray-800 mb-1 font-bold">{label}</div>
        <div>{children}</div>
      </label>
    </div>
  )
}

export default MJUIFormGroup
