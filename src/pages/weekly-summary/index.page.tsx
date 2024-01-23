import TournamentDetailPage from './[week]/index.page'

const week = Math.ceil(
  (new Date().getTime() - 1704988800000) / 1000 / 60 / 60 / 24 / 7
).toString()

const TournamentDetailPageWithLatestWeek = () => {
  return <TournamentDetailPage params={{ week }} />
}

export default TournamentDetailPageWithLatestWeek
