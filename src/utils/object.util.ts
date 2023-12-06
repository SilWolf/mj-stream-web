/* eslint-disable @typescript-eslint/no-explicit-any */
import deepEqual from 'deep-equal'

export const isObjectEqual = (a: any, b: any) => deepEqual(a, b)
