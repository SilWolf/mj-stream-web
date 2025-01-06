/* eslint-disable @typescript-eslint/no-explicit-any */
import deepEqual from 'deep-equal'

export const isObjectEqual = (a: any, b: any) => deepEqual(a, b)

export const mergeObject = <T extends Record<string, unknown>>(
  base: T,
  overrided: T
): T => {
  const res = { ...base }

  for (const key in overrided) {
    if (overrided[key]) {
      res[key] = overrided[key]
    }
  }

  return res
}
