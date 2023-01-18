import React, { HTMLAttributes } from 'react'

export default function TabletLayout({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}
