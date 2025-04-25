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
  matchRounds: Record<string, Record<string, RealtimeMatchRound>>
  players: Record<string, Player>
  teams: Record<string, Team>
}

export type RawMatch = {
  _id: string
  name: string
  startAt: string
  playerEastTeam?: { _ref: string }
  playerEast?: { _ref: string }
  playerSouthTeam?: { _ref: string }
  playerSouth?: { _ref: string }
  playerWestTeam?: { _ref: string }
  playerWest?: { _ref: string }
  playerNorthTeam?: { _ref: string }
  playerNorth?: { _ref: string }
  tournament: {
    _id: string
    name: string
    logoUrl: string
    rulesetId?: string
    themeId?: string
  }
}

export type Match = {
  _id: string
  name: string
  startAt: string
  playerEastTeam?: Team
  playerEast?: Player
  playerSouthTeam?: Team
  playerSouth?: Player
  playerWestTeam?: Team
  playerWest?: Player
  playerNorthTeam?: Team
  playerNorth?: Player
  tournament: {
    _id: string
    name: string
    logoUrl: string
  }
}

export type RawPlayer = {
  playerId: string
  teamId?: string
  position: PlayerIndex
  rank: number
  score: number
  point: number
}

export type Player = {
  _id: string
  name: string | null
  nickname: string | null
  designation: string | null
  portraitImage: string | null
  fullBodyImage: string | null
  introduction: string
  statistics?: PlayerStatistic
}

export type PlayerStatistic = {
  matchCount: number
  roundCount: number
  point: number
  scoreMax: number
  scoreMin: number
  firstCount: number
  secondCount: number
  thirdCount: number
  fourthCount: number
  riichiCount: number
  riichiCountWhenEast: number
  riichiCountWhenNonEast: number
  revealCount: number
  revealCountWhenEast: number
  revealCountWhenNonEast: number
  waitingCount: number
  ronCount: number
  ronCountWhenEast: number
  ronCountWhenNonEast: number
  waitingWhenExhaustedCount: number
  ronPureScoreAvg: number
  ronPureScoreAvgWhenEast: number
  ronPureScoreAvgWhenNonEast: number
  ronHighYakuCount: number
  chuckCount: number
  chuckCountWhenEast: number
  chuckCountWhenNonEast: number
  chuckPureScoreAvg: number
  chuckPureScoreAvgWhenEast: number
  chuckPureScoreAvgWhenNonEast: number
  chuckHighYakuCount: number
  ronAfterRiichiCount: number
  ronAfterRiichiPureScoreAvg: number
  ronAfterRevealCount: number
  ronAfterRevealPureScoreAvg: number
  chuckAfterRiichiCount: number
  chuckAfterRiichiPureScoreAvg: number
  chuckAfterRevealCount: number
  chuckAfterRevealPureScoreAvg: number

  pointRanking: number
  nonFourthP: number
  nonFourthPRanking: number
  firstAndSecondP: number
  firstAndSecondPRanking: number
  riichiP: number
  riichiPRanking: number
  ronP: number
  ronPRanking: number
  chuckP: number
  chuckPRanking: number
  revealP: number
  revealPRanking: number
  ronPureScoreAvgRanking: number
  chuckPureScoreAvgRanking: number
}

export const enum RoundResultTypeEnum {
  Unknown = 0,
  Exhausted = -1,
  Ron = 1,
  SelfDrawn = 2,
  Hotfix = -2,
}

export const enum NextRoundTypeEnum {
  Unknown = 0,
  NextRound = 1,
  Extended = 2,
  NextRoundAndExtended = 3,
  Hotfix = -2,
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
  isYellowCarded?: boolean
  isRedCarded?: boolean
  isRonDisallowed?: boolean
  waitingTiles?: string[]
  detail: {
    han: number
    fu: number
    yakumanCount: number
    dora: number
    redDora: number
    innerDora: number
    yakus:
      | { id: string; label: string; han: number; yakumanCount: number }[]
      | null
    raw: Record<string, boolean> | null
    isRevealed: boolean
    isRiichied: boolean
  }
}

export type MatchSetting = {
  startingScore: '25000' | '30000' | '35000' | '50000' | '100000'
  isManganRoundUp: '0' | '1'
  yakuMax: '12' | '13'
  yakumanMax: '13' | '26' | '39' | '130'
}

export type Team = {
  _id: string
  slug: string
  name: string | null
  secondaryName: string | null
  thirdName: string | null
  preferredName: string | null
  squareLogoImage: string | null
  color: string
  introduction: string
  players: Player[]
  statistics?: {
    matchCount: number
    point: number
    ranking: number
    pointHistories: []
  }
}

export type RealtimeMatch = {
  name: string
  code: string
  databaseId: string
  remark: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  setting: MatchSetting
  players: Record<PlayerIndex, RealtimePlayer>
  activeResultDetail: {
    winnerPlayerIndex: PlayerIndex
    han: number
    fu: number
    yakumanCount: number
    yakus: { id: string; label: string; han: number; yakumanCount: number }[]
  } | null
  showPoints?: boolean | null
  hideHeader?: boolean | null
  hidePlayers?: boolean | null
}

export type RealtimePlayer = {
  primaryName: string
  secondaryName: string
  nickname: string
  color: string
  logoUrl: string | null
  propicUrl: string | null
  largeLogoUrl: string | null
}

export type RealtimeMatchRound = {
  matchId: string
  code: string
  roundCount: number
  extendedRoundCount: number
  cumulatedThousands: number
  nextRoundCumulatedThousands: number
  resultType: RoundResultTypeEnum
  resultDetail?: {
    winnerPlayerIndex: PlayerIndex
    han: number
    fu: number
    yakumanCount: number
    yakus: { id: string; label: string; han: number; yakumanCount: number }[]
  }
  hasBroadcasted?: boolean
  nextRoundType: NextRoundTypeEnum
  playerResults: Record<PlayerIndex, PlayerResult>
  doras: Record<number, string>
}
