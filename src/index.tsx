import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Switch } from 'wouter'
import './index.css'
import reportWebVitals from './reportWebVitals'
import FirebaseDatabaseProvider from './providers/firebaseDatabase.provider'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import IndexPage from './pages/index.page'
import MatchDetailPage from './pages/match/[id]/index.page'
import MatchOBSPage from './pages/match/[id]/obs.page'
import MatchControlPage from './pages/match/[id]/control/index.page'
import PlayersPage from './pages/players/index.page'
import ConfirmDialogProvider from './components/ConfirmDialog/provider'
import CreateMatchPage from './pages/create-match/index.page'
import TeamsPage from './pages/teams/index.page'
import ObsRoomPage from './pages/obs/[obsRoomId]/index.page'
import ObsScorePage from './pages/obs/[obsRoomId]/socre.page'
import MatchesPage from './pages/matches/index.page'
import ObsChartPage from './pages/obs/[obsRoomId]/chart.page'
import ObsCarouselPage from './pages/obs/[obsRoomId]/carousel.page'
import ObsRoomControlPage from './pages/obs/[obsRoomId]/control.page'
import MatchNameplatesPage from './pages/match/[id]/nameplates.page'
import MatchStatPage from './pages/match/[id]/stat/index.page'
import ObsStatPage from './pages/obs/[obsRoomId]/stat.page'
import MatchExportPage from './pages/match/[id]/export/index.page'
import MatchForecastPage from './pages/match/[id]/forecast.page'
import ObsRoomForecastPage from './pages/obs/[obsRoomId]/forecast.page'
import ObsRoomEndPage from './pages/obs/[obsRoomId]/ended.page'
import MatchIntroductionPage from './pages/match/[id]/introduction.page'
import MatchOverviewOverlayPage from './pages/match/[id]/overviewOverlay.page'
import ObsOverviewOverlayPage from './pages/obs/[obsRoomId]/overlay.page'

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      staleTime: Infinity,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FirebaseDatabaseProvider>
        <ConfirmDialogProvider>
          <Switch>
            <Route path="/" component={IndexPage} />
            <Route path="/create-match" component={CreateMatchPage} />
            <Route path="/match/:matchId" component={MatchDetailPage} />
            <Route path="/match/:matchId/obs" component={MatchOBSPage} />
            <Route
              path="/match/:matchId/overlay"
              component={MatchOverviewOverlayPage}
            />
            <Route
              path="/match/:matchId/control"
              component={MatchControlPage}
            />
            <Route path="/match/:matchId/export" component={MatchExportPage} />
            <Route
              path="/match/:matchId/forecast"
              component={MatchForecastPage}
            />
            <Route
              path="/match/:matchId/introduction"
              component={MatchIntroductionPage}
            />
            <Route
              path="/match/:matchId/nameplates"
              component={MatchNameplatesPage}
            />
            <Route path="/match/:matchId/stat" component={MatchStatPage} />

            <Route path="/obs/:obsRoomId" component={ObsRoomPage} />
            <Route
              path="/obs/:obsRoomId/overlay"
              component={ObsOverviewOverlayPage}
            />
            <Route
              path="/obs/:obsRoomId/control"
              component={ObsRoomControlPage}
            />
            <Route
              path="/obs/:obsRoomId/forecast"
              component={ObsRoomForecastPage}
            />
            <Route path="/obs/:obsRoomId/end" component={ObsRoomEndPage} />
            <Route path="/obs/:obsRoomId/score" component={ObsScorePage} />
            <Route path="/obs/:obsRoomId/chart" component={ObsChartPage} />
            <Route
              path="/obs/:obsRoomId/carousel"
              component={ObsCarouselPage}
            />
            <Route path="/obs/:obsRoomId/stat" component={ObsStatPage} />

            <Route path="/players" component={PlayersPage} />
            <Route path="/teams" component={TeamsPage} />
            <Route path="/matches" component={MatchesPage} />
          </Switch>
        </ConfirmDialogProvider>
      </FirebaseDatabaseProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
