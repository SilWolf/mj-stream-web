import { V2Ruleset } from '../models/V2Ruleset.model'
import { q, runQuery } from '../adapters/sanity'
import * as z from 'zod'

// const teamInMatchFragment = q.fragmentForType<'player'>().project(sub => ({

// }))
// const playerInMatchFragment = q.fragmentForType<'player'>().project(sub)

// export const apiGetMatchesByTournamentId = async (tournamentId: string) => {
//   const query = q.star.filterByType('match').order('startAt asc').slice(0, 10).project(sub => ({
//     _id: z.string(),
//     name: z.string().nullable(),
//     playerEast: sub.field('playerEast').deref().project()
//   }))
//   return runQuery()

//   const regularTeams = await getRegularTeamsWithPlayers()
//   return client
//     .fetch<
//       MatchFromSanity[]
//     >(`*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")] | order(startAt asc)[0...10]{ _id, name, playerEast, playerSouth, playerWest, playerNorth, playerEastTeam, playerSouthTeam, playerWestTeam, playerNorthTeam, startAt, tournament->{_id, name, "logoUrl": logo.asset->url} }`)
//     .then((matches) =>
//       matches.map((rawMatch) => {
//         const teamEast = regularTeams.find(
//           ({ team }) => rawMatch.playerEastTeam?._ref === team._id
//         )
//         const playerEast = teamEast?.players.find(
//           ({ _id }) => _id === rawMatch.playerEast?._ref
//         )
//         const teamSouth = regularTeams.find(
//           ({ team }) => rawMatch.playerSouthTeam?._ref === team._id
//         )
//         const playerSouth = teamSouth?.players.find(
//           ({ _id }) => _id === rawMatch.playerSouth?._ref
//         )
//         const teamWest = regularTeams.find(
//           ({ team }) => rawMatch.playerWestTeam?._ref === team._id
//         )
//         const playerWest = teamWest?.players.find(
//           ({ _id }) => _id === rawMatch.playerWest?._ref
//         )
//         const teamNorth = regularTeams.find(
//           ({ team }) => rawMatch.playerNorthTeam?._ref === team._id
//         )
//         const playerNorth = teamNorth?.players.find(
//           ({ _id }) => _id === rawMatch.playerNorth?._ref
//         )

//         const match: Match = {
//           ...rawMatch,
//           playerEast,
//           playerSouth,
//           playerWest,
//           playerNorth,
//           playerEastTeam: teamEast?.team,
//           playerSouthTeam: teamSouth?.team,
//           playerWestTeam: teamWest?.team,
//           playerNorthTeam: teamNorth?.team,
//         }

//         return match
//       })
//     )
// }
