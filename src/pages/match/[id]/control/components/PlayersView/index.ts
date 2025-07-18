import { PlayerIndex, RealtimeMatchRound, RealtimePlayer } from '@/models'

export type PlayersViewAction =
  | 'waitingTile'
  | 'yaku'
  | 'dora-normal-plus'
  | 'dora-normal-minus'
  | 'dora-red-plus'
  | 'dora-red-minus'
  | 'reveal'
  | 'riichi'
  | 'ron-self'
  | 'ron-before'
  | 'ron-after'
  | 'ron-opposite'
  | 'yellow-card'
  | 'red-card'
  | 'disallow-ron'

export type PlayersViewProps = {
  players: Record<PlayerIndex, RealtimePlayer>
  currentRound: RealtimeMatchRound

  onAction: (playerIndex: PlayerIndex, action: PlayersViewAction) => unknown
}
