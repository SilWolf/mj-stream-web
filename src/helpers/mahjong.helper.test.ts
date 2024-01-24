import { describe, it, expect } from 'vitest'
import {
  convertScoresToPointsAndRankings,
  getPlayerPosition,
} from './mahjong.helper'

describe('getPlayerPosition', () => {
  it('Round 1', () => {
    expect(getPlayerPosition('0', 1)).toEqual(0)
    expect(getPlayerPosition('1', 1)).toEqual(1)
    expect(getPlayerPosition('2', 1)).toEqual(2)
    expect(getPlayerPosition('3', 1)).toEqual(3)
  })

  it('Round 2', () => {
    expect(getPlayerPosition('0', 2)).toEqual(3)
    expect(getPlayerPosition('1', 2)).toEqual(0)
    expect(getPlayerPosition('2', 2)).toEqual(1)
    expect(getPlayerPosition('3', 2)).toEqual(2)
  })

  it('Round 3', () => {
    expect(getPlayerPosition('0', 3)).toEqual(2)
    expect(getPlayerPosition('1', 3)).toEqual(3)
    expect(getPlayerPosition('2', 3)).toEqual(0)
    expect(getPlayerPosition('3', 3)).toEqual(1)
  })

  it('Round 4', () => {
    expect(getPlayerPosition('0', 4)).toEqual(1)
    expect(getPlayerPosition('1', 4)).toEqual(2)
    expect(getPlayerPosition('2', 4)).toEqual(3)
    expect(getPlayerPosition('3', 4)).toEqual(0)
  })

  it('Round 5', () => {
    expect(getPlayerPosition('0', 5)).toEqual(0)
    expect(getPlayerPosition('1', 5)).toEqual(1)
    expect(getPlayerPosition('2', 5)).toEqual(2)
    expect(getPlayerPosition('3', 5)).toEqual(3)
  })
})

describe('convertScoresToPointsAndRankings', () => {
  it('When a common match result', () => {
    const results = convertScoresToPointsAndRankings([
      45000, 25000, 15000, 5000,
    ])
    expect(results[0].point).toBeCloseTo(65, 1)
    expect(results[1].point).toBeCloseTo(5, 1)
    expect(results[2].point).toBeCloseTo(-25, 1)
    expect(results[3].point).toBeCloseTo(-55, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(2)
    expect(results[2].ranking).toBe(3)
    expect(results[3].ranking).toBe(4)
  })

  it('When a common match result with uneven scores', () => {
    const results = convertScoresToPointsAndRankings([
      9700, 17200, 32400, 40700,
    ])
    expect(results[0].point).toBeCloseTo(-50.3, 1)
    expect(results[1].point).toBeCloseTo(-22.8, 1)
    expect(results[2].point).toBeCloseTo(+12.4, 1)
    expect(results[3].point).toBeCloseTo(+60.7, 1)
    expect(results[0].ranking).toBe(4)
    expect(results[1].ranking).toBe(3)
    expect(results[2].ranking).toBe(2)
    expect(results[3].ranking).toBe(1)
  })

  it('common scores (1)', () => {
    const results = convertScoresToPointsAndRankings([
      60500, -21600, 2900, 58200,
    ])
    expect(results[0].point).toBeCloseTo(+80.5, 1)
    expect(results[1].point).toBeCloseTo(-81.6, 1)
    expect(results[2].point).toBeCloseTo(-37.1, 1)
    expect(results[3].point).toBeCloseTo(+38.2, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(4)
    expect(results[2].ranking).toBe(3)
    expect(results[3].ranking).toBe(2)
  })

  it('common scores (2)', () => {
    const results = convertScoresToPointsAndRankings([
      20200, 30100, 33600, 16100,
    ])
    expect(results[0].point).toBeCloseTo(-19.8, 1)
    expect(results[1].point).toBeCloseTo(+10.1, 1)
    expect(results[2].point).toBeCloseTo(+53.6, 1)
    expect(results[3].point).toBeCloseTo(-43.9, 1)
    expect(results[0].ranking).toBe(3)
    expect(results[1].ranking).toBe(2)
    expect(results[2].ranking).toBe(1)
    expect(results[3].ranking).toBe(4)
  })

  it('When 4 players are with same score', () => {
    const results = convertScoresToPointsAndRankings([
      25000, 25000, 25000, 25000,
    ])
    expect(results[0].point).toBeCloseTo(0, 1)
    expect(results[1].point).toBeCloseTo(0, 1)
    expect(results[2].point).toBeCloseTo(0, 1)
    expect(results[3].point).toBeCloseTo(0, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(1)
    expect(results[2].ranking).toBe(1)
    expect(results[3].ranking).toBe(1)
  })

  it('When 1st, 2nd, 3rd players are with same score', () => {
    const results = convertScoresToPointsAndRankings([33300, 33300, 100, 33300])
    expect(results[0].point).toBeCloseTo(20.1, 1)
    expect(results[1].point).toBeCloseTo(19.9, 1)
    expect(results[2].point).toBeCloseTo(-59.9, 1)
    expect(results[3].point).toBeCloseTo(19.9, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(1)
    expect(results[2].ranking).toBe(4)
    expect(results[3].ranking).toBe(1)
  })

  it('When 2nd, 3rd, 4th players are with same score', () => {
    const results = convertScoresToPointsAndRankings([
      20000, 20000, 20000, 40000,
    ])
    expect(results[0].point).toBeCloseTo(-20, 1)
    expect(results[1].point).toBeCloseTo(-20, 1)
    expect(results[2].point).toBeCloseTo(-20, 1)
    expect(results[3].point).toBeCloseTo(60, 1)
    expect(results[0].ranking).toBe(2)
    expect(results[1].ranking).toBe(2)
    expect(results[2].ranking).toBe(2)
    expect(results[3].ranking).toBe(1)
  })

  it('When 1st, 2nd players are with same score', () => {
    const results = convertScoresToPointsAndRankings([20000, 40000, 40000, 0])
    expect(results[0].point).toBeCloseTo(-20, 1)
    expect(results[1].point).toBeCloseTo(40, 1)
    expect(results[2].point).toBeCloseTo(40, 1)
    expect(results[3].point).toBeCloseTo(-60, 1)
    expect(results[0].ranking).toBe(3)
    expect(results[1].ranking).toBe(1)
    expect(results[2].ranking).toBe(1)
    expect(results[3].ranking).toBe(4)
  })

  it('When 2nd, 3rd players are with same score', () => {
    const results = convertScoresToPointsAndRankings([30000, 40000, 0, 30000])
    expect(results[0].point).toBeCloseTo(0, 1)
    expect(results[1].point).toBeCloseTo(60, 1)
    expect(results[2].point).toBeCloseTo(-60, 1)
    expect(results[3].point).toBeCloseTo(0, 1)
    expect(results[0].ranking).toBe(2)
    expect(results[1].ranking).toBe(1)
    expect(results[2].ranking).toBe(4)
    expect(results[3].ranking).toBe(2)
  })

  it('When 3rd, 4th players are with same score', () => {
    const results = convertScoresToPointsAndRankings([
      60000, -2000, -2000, 44000,
    ])
    expect(results[0].point).toBeCloseTo(80, 1)
    expect(results[1].point).toBeCloseTo(-52, 1)
    expect(results[2].point).toBeCloseTo(-52, 1)
    expect(results[3].point).toBeCloseTo(24, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(3)
    expect(results[2].ranking).toBe(3)
    expect(results[3].ranking).toBe(2)
  })

  it('When 1st 2nd players are with same score && 3rd 4th players are with same score', () => {
    const results = convertScoresToPointsAndRankings([
      40000, 10000, 40000, 10000,
    ])
    expect(results[0].point).toBeCloseTo(40, 1)
    expect(results[1].point).toBeCloseTo(-40, 1)
    expect(results[2].point).toBeCloseTo(40, 1)
    expect(results[3].point).toBeCloseTo(-40, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(3)
    expect(results[2].ranking).toBe(1)
    expect(results[3].ranking).toBe(3)
  })

  it('When [25000, 25000, 25000, 25000] with weird origin score=28000', () => {
    const results = convertScoresToPointsAndRankings(
      [25000, 25000, 25000, 25000],
      28000
    )
    expect(results[0].point).toBeCloseTo(2, 1)
    expect(results[1].point).toBeCloseTo(2, 1)
    expect(results[2].point).toBeCloseTo(2, 1)
    expect(results[3].point).toBeCloseTo(2, 1)
    expect(results[0].ranking).toBe(1)
    expect(results[1].ranking).toBe(1)
    expect(results[2].ranking).toBe(1)
    expect(results[3].ranking).toBe(1)
  })
})
