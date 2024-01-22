import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  players: Record<
    'playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth',
    { name: string; color: string }
  >
  rounds: {
    name: string
    playerEast: number
    playerSouth: number
    playerWest: number
    playerNorth: number
  }[]
}

function MJMatchHistoryChart({ players, rounds }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rounds}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis tick={{ fill: 'white' }} dataKey="name" />
        <YAxis
          tick={{ fill: 'white' }}
          width={120}
          allowDecimals={false}
          tickCount={5}
        />
        {/* <Legend /> */}
        <Line
          type="linear"
          stroke="#FFF"
          strokeWidth={10}
          isAnimationActive={false}
          dataKey="playerEast"
        />
        <Line
          type="linear"
          stroke={players.playerEast.color}
          strokeWidth={8}
          isAnimationActive={false}
          name={players.playerEast.name}
          dataKey="playerEast"
        />

        <Line
          type="linear"
          stroke="#FFF"
          strokeWidth={10}
          isAnimationActive={false}
          dataKey="playerSouth"
        />
        <Line
          type="linear"
          stroke={players.playerSouth.color}
          strokeWidth={8}
          isAnimationActive={false}
          name={players.playerSouth.name}
          dataKey="playerSouth"
        />

        <Line
          type="linear"
          stroke="#FFF"
          strokeWidth={10}
          isAnimationActive={false}
          dataKey="playerWest"
        />
        <Line
          type="linear"
          stroke={players.playerWest.color}
          strokeWidth={8}
          isAnimationActive={false}
          name={players.playerWest.name}
          dataKey="playerWest"
        />

        <Line
          type="linear"
          stroke="#FFF"
          strokeWidth={10}
          isAnimationActive={false}
          dataKey="playerNorth"
        />
        <Line
          type="linear"
          stroke={players.playerNorth.color}
          strokeWidth={8}
          isAnimationActive={false}
          name={players.playerNorth.name}
          dataKey="playerNorth"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MJMatchHistoryChart
