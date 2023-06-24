export type PlayerIndex = '0' | '1' | '2' | '3'

/**
 * DatabaseRoot
 */
export type Database = {
  v1: DatabaseV1
}

/**
 * DatabaseV1
 * @description root interface of database
 */
export type DatabaseV1 = {
  matches: Record<string, Match>
  matchRounds: Record<string, Record<string, MatchRound>>
  players: Record<string, Player>
}

export type MatchBase = {
  code: string
  remark: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  setting: MatchSetting
}

/**
 * Match
 * @description interface of a full match
 */
export type Match = MatchBase &
  Record<
    string, // player_{id}
    RawPlayer
  >

export type RawPlayer = {
  position: PlayerIndex
  rank: number
  score: number
  point: number
}

export type Player = {
  title?: string
  name: string
  propicSrc?: string
  color?: string
}

export type MatchRound = {
  matchId: string
  code: string
  roundCount: number
  extendedRoundCount: number
  cumulatedThousands: number
  resultType: RoundResultTypeEnum
  nextRoundType: NextRoundTypeEnum
  playerResults: Record<PlayerIndex, PlayerResult>
  doras: Record<number, string>
}

export const enum RoundResultTypeEnum {
  Unknown = 0,
  Exhausted = -1,
  Ron = 1,
  SelfDrawn = 2,
}

export const enum NextRoundTypeEnum {
  Unknown = 0,
  Normal = 1,
  Extended = 2,
  End = -1,
}

export const enum PlayerResultWinnerOrLoserEnum {
  Win = 1,
  Lose = -1,
  None = 0,
}

export const enum PlayerPositionEnum {
  East = 0,
  South = 1,
  West = 2,
  North = 3,
}

export type PlayerResult = {
  beforeScore: number
  afterScore: number
  scoreChanges: number[]
  prevScoreChanges: number[]
  type: PlayerResultWinnerOrLoserEnum
  isRiichi?: boolean
  isRevealed?: boolean
}

export type MatchSetting = Record<string, string>
