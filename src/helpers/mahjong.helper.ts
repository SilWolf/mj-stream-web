import {
  PlayerIndex,
  PlayerPositionEnum,
  PlayerResult,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import { getRandomId, getYearString } from '@/utils/string.util'

const PLAYER_POSITION_ARRAY = [
  PlayerPositionEnum.East,
  PlayerPositionEnum.South,
  PlayerPositionEnum.West,
  PlayerPositionEnum.North,
]

const PLAYER_INDEX_ARRAY: PlayerIndex[] = ['0', '1', '2', '3']

export const convertPlayerIndexToPosition = (playerIndex: PlayerIndex) =>
  parseInt(playerIndex, 10)

export const getPlayerPosition = (
  playerIndex: PlayerIndex,
  round: number
): PlayerPositionEnum =>
  PLAYER_POSITION_ARRAY[
    (4 +
      convertPlayerIndexToPosition(playerIndex) -
      ((round - 1) % PLAYER_POSITION_ARRAY.length)) %
      PLAYER_POSITION_ARRAY.length
  ]

export const getIsPlayerEast = (playerIndex: PlayerIndex, round: number) =>
  getPlayerPosition(playerIndex, round) === PlayerPositionEnum.East
export const getIsPlayerSouth = (playerIndex: PlayerIndex, round: number) =>
  getPlayerPosition(playerIndex, round) === PlayerPositionEnum.South
export const getIsPlayerWest = (playerIndex: PlayerIndex, round: number) =>
  getPlayerPosition(playerIndex, round) === PlayerPositionEnum.West
export const getIsPlayerNorth = (playerIndex: PlayerIndex, round: number) =>
  getPlayerPosition(playerIndex, round) === PlayerPositionEnum.North

export const getIsRoundEast = (round: number) => round >= 1 && round <= 4
export const getIsRoundSouth = (round: number) => round >= 5 && round <= 8
export const getIsRoundWest = (round: number) => round >= 9 && round <= 12
export const getIsRoundNorth = (round: number) => round >= 13 && round <= 16

export type MJHanFuScore = {
  ne: number // non-east
  e: number // east
  ner: number // non-east ron
  er: number // east ron
}

export type MJCompiledScore = {
  win: number
  all?: number
  east?: number
  others?: number
  target?: number
}

export const HAN_FU_MODE_SCORE_MAP: Record<string, MJHanFuScore> = {
  // 1 han, 20fu - 110fu
  '1h20f': { ne: 200, e: 400, ner: 1000, er: 1500 },
  '1h25f': { ne: 200, e: 400, ner: 1000, er: 1500 },
  '1h30f': { ne: 300, e: 500, ner: 1000, er: 1500 },
  '1h40f': { ne: 400, e: 700, ner: 1300, er: 2000 },
  '1h50f': { ne: 400, e: 800, ner: 1600, er: 2400 },
  '1h60f': { ne: 500, e: 1000, ner: 2000, er: 2900 },
  '1h70f': { ne: 600, e: 1200, ner: 2300, er: 3400 },
  '1h80f': { ne: 700, e: 1300, ner: 2600, er: 3900 },
  '1h90f': { ne: 800, e: 1500, ner: 2900, er: 4400 },
  '1h100f': { ne: 800, e: 1600, ner: 3200, er: 4800 },
  '1h110f': { ne: 900, e: 1800, ner: 3600, er: 5300 },

  // 2 han, 20fu - 110fu
  '2h20f': { ne: 400, e: 700, ner: 1500, er: 2100 },
  '2h25f': { ne: 400, e: 800, ner: 1600, er: 2400 },
  '2h30f': { ne: 500, e: 1000, ner: 2000, er: 2900 },
  '2h40f': { ne: 700, e: 1300, ner: 2600, er: 3900 },
  '2h50f': { ne: 800, e: 1600, ner: 3200, er: 4800 },
  '2h60f': { ne: 1000, e: 2000, ner: 3900, er: 5800 },
  '2h70f': { ne: 1200, e: 2300, ner: 4500, er: 6800 },
  '2h80f': { ne: 1300, e: 2600, ner: 5200, er: 7700 },
  '2h90f': { ne: 1500, e: 2900, ner: 5800, er: 8700 },
  '2h100f': { ne: 1600, e: 3200, ner: 6400, er: 9600 },
  '2h110f': { ne: 1800, e: 3600, ner: 7100, er: 10600 },

  // 3 han, 20fu - 60fu
  '3h20f': { ne: 700, e: 1300, ner: 2600, er: 3900 },
  '3h25f': { ne: 800, e: 1600, ner: 3200, er: 4800 },
  '3h30f': { ne: 1000, e: 2000, ner: 3900, er: 5800 },
  '3h40f': { ne: 1300, e: 2600, ner: 5200, er: 7700 },
  '3h50f': { ne: 1600, e: 3200, ner: 6400, er: 9600 },
  '3h60f': { ne: 2000, e: 3900, ner: 7700, er: 11600 },

  // 4 han, 20fu - 30fu
  '4h20f': { ne: 1300, e: 2600, ner: 5200, er: 7700 },
  '4h25f': { ne: 1600, e: 3200, ner: 6400, er: 9600 },
  '4h30f': { ne: 2000, e: 3900, ner: 7700, er: 11600 },

  // 5 han
  '5h': { ne: 2000, e: 4000, ner: 8000, er: 12000 },

  // 6-7 han
  '6h': { ne: 3000, e: 6000, ner: 12000, er: 18000 },
  '7h': { ne: 3000, e: 6000, ner: 12000, er: 18000 },

  // 9-10 han
  '8h': { ne: 4000, e: 8000, ner: 16000, er: 24000 },
  '9h': { ne: 4000, e: 8000, ner: 16000, er: 24000 },
  '10h': { ne: 4000, e: 8000, ner: 16000, er: 24000 },

  // 11-12 han
  '11h': { ne: 6000, e: 12000, ner: 24000, er: 36000 },
  '12h': { ne: 6000, e: 12000, ner: 24000, er: 36000 },
}

export const YAKUMAN_MODE_SCORE_MAP: MJHanFuScore = {
  ne: 8000,
  e: 16000,
  ner: 32000,
  er: 48000,
}

export const getScoreByHanAndFu = (
  han: number | string,
  fu: number | string,
  options?: { roundUp?: boolean }
) => {
  let expectedScore: MJHanFuScore | undefined

  const nHan = parseInt(han as string, 10)
  if (Number.isNaN(nHan)) {
    throw new Error(`han "${han}" is NaN`)
  }

  const nFu = parseInt(fu as string, 10)
  if (Number.isNaN(nFu)) {
    throw new Error(`fu "${fu}" is NaN`)
  }

  if (nHan >= 13) {
    expectedScore = HAN_FU_MODE_SCORE_MAP['12h']
  } else if (nHan >= 5) {
    expectedScore = HAN_FU_MODE_SCORE_MAP[`${nHan}h`]
  } else if (nHan >= 4 && nFu >= (options?.roundUp ? 30 : 40)) {
    expectedScore = HAN_FU_MODE_SCORE_MAP['5h']
  } else if (nHan >= 3 && nFu >= (options?.roundUp ? 60 : 70)) {
    expectedScore = HAN_FU_MODE_SCORE_MAP['5h']
  } else {
    expectedScore = HAN_FU_MODE_SCORE_MAP[`${nHan}h${nFu}f`]
  }

  if (!expectedScore) {
    return HAN_FU_MODE_SCORE_MAP['1h30f']
  }

  return expectedScore
}

export const getScoreByYakumanCount = (yakumanCount = 1) => ({
  ne: 8000 * yakumanCount,
  e: 16000 * yakumanCount,
  ner: 32000 * yakumanCount,
  er: 48000 * yakumanCount,
})

export const getScoreInFullDetail = (
  han: number | string,
  fu: number | string,
  yakumanCount: number,
  isEast: boolean,
  isRon: boolean,
  options?: { roundUp?: boolean; yakumanMax?: '13' | '26' | '39' | '130' }
) => {
  const score =
    yakumanCount > 0
      ? getScoreByYakumanCount(
          Math.min(
            convertYakumanMaxToCountMax(options?.yakumanMax ?? '130'),
            yakumanCount
          )
        )
      : getScoreByHanAndFu(han, fu, options)

  if (isEast) {
    if (isRon) {
      return { win: score.er, target: score.er }
    } else {
      return { win: score.e * 3, all: score.e }
    }
  } else if (isRon) {
    return { win: score.ner, target: score.ner }
  } else {
    return {
      win: score.e + 2 * score.ne,
      east: score.e,
      others: score.ne,
    }
  }
}

export const getRoundResultTypeByCompiledScore = (
  compiledScore: MJCompiledScore
): RoundResultTypeEnum => {
  if (compiledScore.all || compiledScore.east) {
    return RoundResultTypeEnum.SelfDrawn
  }

  if (compiledScore.target) {
    return RoundResultTypeEnum.Ron
  }

  return RoundResultTypeEnum.Unknown
}

export const getPlayerIndexOfEastByRound = (round: number): PlayerIndex =>
  PLAYER_INDEX_ARRAY[(round - 1) % PLAYER_INDEX_ARRAY.length]

export const formatPlayerResultsByPrev = (
  prev: Record<PlayerIndex, PlayerResult>
): Record<PlayerIndex, PlayerResult> => {
  return {
    '0': {
      beforeScore: prev['0'].afterScore,
      afterScore: prev['0'].afterScore,
      isRevealed: false,
      isRiichi: false,
      isYellowCarded: prev['0'].isYellowCarded || false,
      isRedCarded: prev['0'].isRedCarded || false,
      type: PlayerResultWinnerOrLoserEnum.None,
      scoreChanges: [],
      prevScoreChanges: prev['0'].scoreChanges ?? [],
      detail: {
        han: 1,
        fu: 30,
        yakumanCount: 0,
        dora: 0,
        redDora: 0,
        innerDora: 0,
        yakus: [],
        raw: {},
        isRevealed: false,
        isRiichied: false,
      },
    },
    '1': {
      beforeScore: prev['1'].afterScore,
      afterScore: prev['1'].afterScore,
      isRevealed: false,
      isRiichi: false,
      isYellowCarded: prev['1'].isYellowCarded || false,
      isRedCarded: prev['1'].isRedCarded || false,
      type: PlayerResultWinnerOrLoserEnum.None,
      scoreChanges: [],
      prevScoreChanges: prev['1'].scoreChanges ?? [],
      detail: {
        han: 1,
        fu: 30,
        yakumanCount: 0,
        dora: 0,
        redDora: 0,
        innerDora: 0,
        yakus: [],
        raw: {},
        isRevealed: false,
        isRiichied: false,
      },
    },
    '2': {
      beforeScore: prev['2'].afterScore,
      afterScore: prev['2'].afterScore,
      isRevealed: false,
      isRiichi: false,
      isYellowCarded: prev['2'].isYellowCarded || false,
      isRedCarded: prev['2'].isRedCarded || false,
      type: PlayerResultWinnerOrLoserEnum.None,
      scoreChanges: [],
      prevScoreChanges: prev['2'].scoreChanges ?? [],
      detail: {
        han: 1,
        fu: 30,
        yakumanCount: 0,
        dora: 0,
        redDora: 0,
        innerDora: 0,
        yakus: [],
        raw: {},
        isRevealed: false,
        isRiichied: false,
      },
    },
    '3': {
      beforeScore: prev['3'].afterScore,
      afterScore: prev['3'].afterScore,
      isRevealed: false,
      isRiichi: false,
      isYellowCarded: prev['3'].isYellowCarded || false,
      isRedCarded: prev['3'].isRedCarded || false,
      type: PlayerResultWinnerOrLoserEnum.None,
      scoreChanges: [],
      prevScoreChanges: prev['3'].scoreChanges ?? [],
      detail: {
        han: 1,
        fu: 30,
        yakumanCount: 0,
        dora: 0,
        redDora: 0,
        innerDora: 0,
        yakus: [],
        raw: {},
        isRevealed: false,
        isRiichied: false,
      },
    },
  }
}

export const formatPlayerResultsByPreviousPlayerResults = (
  prev: Record<PlayerIndex, PlayerResult>
): Record<PlayerIndex, PlayerResult> =>
  formatPlayerResultsByPrev({
    '0': prev['0'],
    '1': prev['1'],
    '2': prev['2'],
    '3': prev['3'],
  })

export const generateMatchCode = () => `${getYearString()}-${getRandomId(6)}`

export const generateMatchRoundCode = (
  matchCode: string,
  round: number,
  extendedRound: number
) => `${matchCode}-${round}.${extendedRound}`

const ROUND_MAP: Record<string, string> = {
  1: '東 1 局',
  2: '東 2 局',
  3: '東 3 局',
  4: '東 4 局',
  5: '南 1 局',
  6: '南 2 局',
  7: '南 3 局',
  8: '南 4 局',
  9: '西 1 局',
  10: '西 2 局',
  11: '西 3 局',
  12: '西 4 局',
  13: '北 1 局',
  14: '北 2 局',
  15: '北 3 局',
  16: '北 4 局',
}

export const generateMatchRoundText = (
  round: number,
  extendedRound: number,
  max = 8
) => {
  try {
    const roundText = ROUND_MAP[Math.min(round, max)]
    if (!roundText) {
      throw new Error(`Unable to parse round=${round} in MJMatchCounterSpan`)
    }

    return extendedRound && extendedRound !== 0
      ? `${roundText}${extendedRound}本場`
      : roundText
  } catch (e) {
    console.error(e)
    return `${round}.${extendedRound ?? 0}`
  }
}

export const getBeforeOfPlayerIndex = (playerIndex: PlayerIndex) => {
  switch (playerIndex) {
    case '0':
      return '3'
    case '1':
      return '0'
    case '2':
      return '1'
    case '3':
      return '2'
  }
}

export const getAfterOfPlayerIndex = (playerIndex: PlayerIndex) => {
  switch (playerIndex) {
    case '0':
      return '1'
    case '1':
      return '2'
    case '2':
      return '3'
    case '3':
      return '0'
  }
}

export const getOppositeOfPlayerIndex = (playerIndex: PlayerIndex) => {
  switch (playerIndex) {
    case '0':
      return '2'
    case '1':
      return '3'
    case '2':
      return '0'
    case '3':
      return '1'
  }
}

export const convertYakumanMaxToCountMax = (
  value: '13' | '26' | '39' | '130'
) => {
  switch (value) {
    case '13':
      return 1
    case '26':
      return 2
    case '39':
      return 3
    case '130':
      return 10
  }
}

export class MahjongRenderer {
  yakumanCountMax: number = 10
  isManganRoundUp: boolean = true

  constructor(props: { yakumanCountMax?: number; isManganRoundUp?: boolean }) {
    if (typeof props?.yakumanCountMax !== 'undefined') {
      this.yakumanCountMax = props.yakumanCountMax
    }
    if (typeof props?.isManganRoundUp !== 'undefined') {
      this.isManganRoundUp = props.isManganRoundUp
    }
  }

  renderHanFu(
    han: number = 1,
    fu: number = 30,
    yakumanCount: number = 0,
    options?: { raw?: boolean }
  ): string {
    if (yakumanCount && yakumanCount > 0) {
      const trueYakumanCount = Math.min(
        this.yakumanCountMax ?? 10,
        yakumanCount
      )
      if (trueYakumanCount === 1) {
        return '役滿'
      } else if (trueYakumanCount === 2) {
        return '兩倍役滿'
      } else if (trueYakumanCount === 3) {
        return '三倍役滿'
      } else if (trueYakumanCount === 4) {
        return '四倍役滿'
      } else {
        return `${trueYakumanCount}倍役滿`
      }
    }

    if (options?.raw) {
      if (typeof fu !== 'undefined' && han <= 4) {
        return `${han}飜${fu}符`
      }

      return `${han}飜`
    }

    if (han >= 11) {
      return '三倍滿'
    } else if (han >= 8) {
      return '倍滿'
    } else if (han >= 6) {
      return '跳滿'
    } else if (han >= 5) {
      return '滿貫'
    } else if (
      han >= 4 &&
      typeof fu !== 'undefined' &&
      (fu >= 40 || (this.isManganRoundUp && fu >= 30))
    ) {
      return '滿貫'
    } else if (
      han >= 3 &&
      typeof fu !== 'undefined' &&
      (fu >= 70 || (this.isManganRoundUp && fu >= 60))
    ) {
      return '滿貫'
    } else if (typeof fu !== 'undefined') {
      return `${han}飜${fu}符`
    }

    return `${han}飜`
  }

  renderRawHanFu(
    han: number = 1,
    fu: number = 30,
    yakumanCount: number = 0
  ): string {
    return this.renderHanFu(han, fu, yakumanCount, {
      raw: true,
    })
  }
}
