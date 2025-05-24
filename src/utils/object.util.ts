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

export function theFirstNonNull(...args: unknown[]) {
  return args.find((item) => !!item)
}

export function arrayToObject<T extends string, U>(arr: T[], value: U) {
  const result: Partial<Record<T, U>> = {}
  for (const key of arr) {
    result[key] = value
  }
  return result as Record<T, U>
}
