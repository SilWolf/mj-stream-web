import { MatchRound, Player, PlayerIndex } from '@/models'

export type PlayersViewProps = {
  players: Record<PlayerIndex, Player>
  currentRound: MatchRound
}

export type PlayersViewSingletonProps = {
  player: Player
}
