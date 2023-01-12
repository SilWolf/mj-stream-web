export type PlayerIndex = 0 | 1 | 2 | 3

export type Database = {
  games: Record<string, Game>
  gameDetails: Record<string, Game>
  gameActiveRounds: Record<string, Round>
  players: Record<string, Player>
  playerIdentities: Record<string, PlayerIdentity>
  playerPlayerIdentities: Record<string, string>
  playerGames: Record<string, string>
  settings: Record<string, Setting>
}

export type Game = {
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

export type GameDetail = Pick<Game, 'id'> & {
  setting: Setting
  rounds: Record<string, Round>
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

type Round_Base = {
  id: string
  code: string
  playerInRoundMap: Record<PlayerIndex, PlayerInRound>
  jackpot: number
  doras: string[]
}

type Round_ResultTypeExhausted = {
  resultType: RoundResultTypeEnum.Exhausted
  winners: PlayerIndex[]
  losers: PlayerIndex[]
}

type Round_ResultTypeRon = {
  resultType: RoundResultTypeEnum.Ron
  winner: PlayerIndex
  loser: PlayerIndex
}

type Round_ResultTypeSelfDrawn = {
  resultType: RoundResultTypeEnum.SelfDrawn
  winner: PlayerIndex
}

type Round_ResultTypeUnknown = {
  resultType: RoundResultTypeEnum.Unknown
}

type Round_AllResultType =
  | Round_ResultTypeExhausted
  | Round_ResultTypeRon
  | Round_ResultTypeSelfDrawn
  | Round_ResultTypeUnknown

export type Round = Round_Base & Round_AllResultType

export enum RoundResultTypeEnum {
  Unknown = 0,
  Exhausted = -1,
  Ron = 1,
  SelfDrawn = 2,
}

export type PlayerInRound = {
  beforeScore: number
  afterScore: number
  isWinner: boolean
  isLoser: boolean
}

export type Setting = Record<string, string>
