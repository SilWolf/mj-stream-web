export type PlayerIndex = 0 | 1 | 2 | 3

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
  code: string
  name: string
  title?: string
  propicSrc?: string
  masterPlayerId?: string
}

export type MatchRound = {
  matchId: string
  code: string
  counter: string
  jackpot: number
  resultType: RoundResultTypeEnum
  playerResults: Record<PlayerIndex, PlayerResult>
  doras: string[]
}

export enum RoundResultTypeEnum {
  Unknown = 0,
  Exhausted = -1,
  Ron = 1,
  SelfDrawn = 2,
}

export enum PlayerResultWinnerOrLoserEnum {
  Win = 1,
  Lose = -1,
  None = 0,
}

export type PlayerResult = {
  beforeScore: number
  afterScore: number
  type: PlayerResultWinnerOrLoserEnum
  isRiichi?: boolean
  isRevealed?: boolean
}

export type MatchSetting = Record<string, string>
