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
  matchRounds: Record<
    Match['id'],
    Record<MatchRound['id'] | 'active', MatchRound>
  >
  players: Record<Player['id'], Player>
  playerMatches: Record<
    Player['id'],
    Record<Match['id'], { id: Match['id']; createdAt: string }>
  >
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
    {
      id: Player['id']
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
  setting: MatchSetting
}

export type Player = {
  id: string
  code: string
  name: string
  title?: string
  propicSrc?: string
  masterPlayerId?: string
}

export type MatchRound = {
  id: string
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
