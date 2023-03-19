/* eslint-disable import/no-extraneous-dependencies */
export const isSameArray = (
  a: unknown[] | undefined,
  b: unknown[] | undefined
) => {
  if (typeof a !== typeof b) {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }

    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) {
        return false
      }
    }
  }

  return true
}

export const convertArrayToObject = <T = unknown>(
  arr: T[]
): Record<string, T> => {
  const result: Record<string, T> = {}

  for (let i = 0; i < arr.length; i += 1) {
    result[i.toString()] = arr[i]
  }

  return result
}

export const getLastItemOfArray = <T = unknown>(arr: T[]) => {
  if (arr.length === 0) {
    return undefined
  }

  return arr[arr.length - 1]
}
