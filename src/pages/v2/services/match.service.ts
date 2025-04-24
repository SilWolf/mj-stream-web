import { V2Ruleset } from '../models/V2Ruleset.model'
import client from '../adapters/sanity.adapter'

type MatchFromSanity = {
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
  }
}

export const apiGetMatches = async () => {
  const regularTeams = await getRegularTeamsWithPlayers()
  return client
    .fetch<
      MatchFromSanity[]
    >(`*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")] | order(startAt asc)[0...10]{ _id, name, playerEast, playerSouth, playerWest, playerNorth, playerEastTeam, playerSouthTeam, playerWestTeam, playerNorthTeam, startAt, tournament->{_id, name, "logoUrl": logo.asset->url} }`)
    .then((matches) =>
      matches.map((rawMatch) => {
        const teamEast = regularTeams.find(
          ({ team }) => rawMatch.playerEastTeam?._ref === team._id
        )
        const playerEast = teamEast?.players.find(
          ({ _id }) => _id === rawMatch.playerEast?._ref
        )
        const teamSouth = regularTeams.find(
          ({ team }) => rawMatch.playerSouthTeam?._ref === team._id
        )
        const playerSouth = teamSouth?.players.find(
          ({ _id }) => _id === rawMatch.playerSouth?._ref
        )
        const teamWest = regularTeams.find(
          ({ team }) => rawMatch.playerWestTeam?._ref === team._id
        )
        const playerWest = teamWest?.players.find(
          ({ _id }) => _id === rawMatch.playerWest?._ref
        )
        const teamNorth = regularTeams.find(
          ({ team }) => rawMatch.playerNorthTeam?._ref === team._id
        )
        const playerNorth = teamNorth?.players.find(
          ({ _id }) => _id === rawMatch.playerNorth?._ref
        )

        const match: Match = {
          ...rawMatch,
          playerEast,
          playerSouth,
          playerWest,
          playerNorth,
          playerEastTeam: teamEast?.team,
          playerSouthTeam: teamSouth?.team,
          playerWestTeam: teamWest?.team,
          playerNorthTeam: teamNorth?.team,
        }

        return match
      })
    )
}
