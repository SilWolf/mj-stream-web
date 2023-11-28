import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  label: React.ReactNode
  action?: React.ReactNode
}

function MJUIFormGroup({ children, label, action, ...divProps }: Props) {
  return (
    <div {...divProps}>
      <label>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-800 font-bold">{label}</p>
          <div>{action}</div>
        </div>
        <div>{children}</div>
      </label>
    </div>
  )
}

export default MJUIFormGroup
