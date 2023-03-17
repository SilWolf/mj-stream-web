import { getPlayerPosition } from './mahjong.helper'

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
