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
  matches: Record<Match['id'], Match>
  matchDetails: Record<Match['id'], MatchDetail>
  matchActiveRounds: Record<Match['id'], MatchRound>
  players: Record<Player['id'], Player>
  playerIdentities: Record<PlayerIdentity['id'], PlayerIdentity>
  playerPlayerIdentities: Record<Player['id'], PlayerIdentity['id']>
  playerMatches: Record<Player['id'], string>
  settings: Record<Match['id'], Setting>
}

/**
 * Match
 * @description interface of a full match
 */
export type Match = {
  id: string
  code: string
  players: Record<
    PlayerIndex,
    PlayerIdentity & {
      rank: number
      score: number
      point: number
    }
  >
  remark: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export type MatchDetail = Pick<Match, 'id'> & {
  setting: Setting
  rounds: Record<string, MatchRound>
}

export type Player = {
  id: string
  code: string
}

export type PlayerIdentity = {
  id: string
  code: string
  name: string
  title?: string
  propicSrc?: string
}

type MatchRound = {
  id: string
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

export type Setting = Record<string, string>
