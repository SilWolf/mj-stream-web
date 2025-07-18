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
import ConfirmDialogProvider from './components/ConfirmDialog/provider'
import ObsRoomPage from './pages/obs/[obsRoomId]/index.page'
import ObsScorePage from './pages/obs/[obsRoomId]/socre.page'
import ObsChartPage from './pages/obs/[obsRoomId]/chart.page'
import ObsCarouselPage from './pages/obs/[obsRoomId]/carousel.page'
import ObsRoomControlPage from './pages/obs/[obsRoomId]/control.page'
import MatchStatPage from './pages/match/[id]/stat/index.page'
import ObsStatPage from './pages/obs/[obsRoomId]/stat.page'
import MatchExportPage from './pages/match/[id]/export/index.page'
import MatchForecastPage from './pages/match/[id]/forecast.page'
import ObsRoomForecastPage from './pages/obs/[obsRoomId]/forecast.page'
import ObsRoomEndPage from './pages/obs/[obsRoomId]/ended.page'
import MatchIntroductionPage from './pages/match/[id]/introduction.page'
import MatchOverviewOverlayPage from './pages/match/[id]/overviewOverlay.page'
import ObsOverviewOverlayPage from './pages/obs/[obsRoomId]/overlay.page'
import ObsRoomExportPage from './pages/obs/[obsRoomId]/export.page'
import RealtimeSummaryPage from './pages/realtime-summary/index.page'
import ObsRoomIntroductionPage from './pages/obs/[obsRoomId]/introduction.page'
import MatchSummaryPage from './pages/match/[id]/summary.page'
import ObsRoomSummaryPage from './pages/obs/[obsRoomId]/summary.page'
import AllNameplatesPage from './pages/nameplaces/index.page'
import ObsRoomSceneControlPage, {
  ObsRoomScenePage,
} from './pages/obs/[obsRoomId]/scene/index.page'

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
            <Route path="/v1" component={IndexPage} />
            <Route path="/v1/match/:matchId" component={MatchDetailPage} />
            <Route path="/v1/match/:matchId/obs" component={MatchOBSPage} />
            <Route
              path="/v1/match/:matchId/overlay"
              component={MatchOverviewOverlayPage}
            />
            <Route
              path="/v1/match/:matchId/control"
              component={MatchControlPage}
            />
            <Route
              path="/v1/match/:matchId/export"
              component={MatchExportPage}
            />
            <Route
              path="/v1/match/:matchId/forecast"
              component={MatchForecastPage}
            />
            <Route
              path="/v1/match/:matchId/introduction"
              component={MatchIntroductionPage}
            />
            <Route
              path="/v1/match/:matchId/summary"
              component={MatchSummaryPage}
            />
            <Route path="/v1/match/:matchId/stat" component={MatchStatPage} />

            <Route path="/v1/obs/:obsRoomId" component={ObsRoomPage} />
            <Route
              path="/v1/obs/:obsRoomId/scene"
              component={ObsRoomScenePage}
            />
            <Route
              path="/v1/obs/:obsRoomId/scene-control"
              component={ObsRoomSceneControlPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/overlay"
              component={ObsOverviewOverlayPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/control"
              component={ObsRoomControlPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/export"
              component={ObsRoomExportPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/forecast"
              component={ObsRoomForecastPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/introduction"
              component={ObsRoomIntroductionPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/summary"
              component={ObsRoomSummaryPage}
            />
            <Route
              path="/v1/obs/:obsRoomId/realtime-summary"
              component={RealtimeSummaryPage}
            />
            <Route path="/v1/obs/:obsRoomId/end" component={ObsRoomEndPage} />
            <Route path="/v1/obs/:obsRoomId/score" component={ObsScorePage} />
            <Route path="/v1/obs/:obsRoomId/chart" component={ObsChartPage} />
            <Route
              path="/v1/obs/:obsRoomId/carousel"
              component={ObsCarouselPage}
            />
            <Route path="/v1/obs/:obsRoomId/stat" component={ObsStatPage} />

            <Route
              path="/v1/realtime-summary/"
              component={RealtimeSummaryPage}
            />
            <Route
              path="/v1/tournament/nameplates"
              component={AllNameplatesPage}
            />
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
