import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { Redirect, Route, Switch } from 'wouter'
import './index.css'
import FirebaseDatabaseProvider from './providers/firebaseDatabase.provider'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'

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

const V2PanelLayout = lazy(
  () => import('./pages/v2/layouts/V2PanelLayout.layout')
)
const V2IndexPage = lazy(() => import('./pages/v2/page'))
const V2PanelPage = lazy(() => import('./pages/v2/panel/page'))
const V2PanelMatchesByIdEditPage = lazy(
  () => import('./pages/v2/panel/matches/[matchId]/edit/page')
)

const V2PanelObsMatchControlPage = lazy(
  () => import('./pages/v2/panel/obs/match-control/page')
)
const V2PanelObsSceneControlPage = lazy(
  () => import('./pages/v2/panel/obs/scene-control/page')
)
const V2ObsSceneMasterPage = lazy(
  () => import('./pages/v2/obs/scenes/master/page')
)

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
      throwOnError(error) {
        toast.error((error as Error)?.message ?? '未知錯誤')
        return false
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FirebaseDatabaseProvider>
        <ConfirmDialogProvider>
          <Switch>
            <Route path="/nameplates" component={AllNameplatesPage} />

            {/* Pages for v2 site */}
            <Route path="/panel" nest>
              <V2PanelLayout>
                <Route path="/" component={V2PanelPage} />
                <Route
                  path="/matches/:matchId/edit"
                  component={V2PanelMatchesByIdEditPage}
                />
                <Route
                  path="/obs/match-control"
                  component={V2PanelObsMatchControlPage}
                />
                <Route
                  path="/obs/scene-control"
                  component={V2PanelObsSceneControlPage}
                />
              </V2PanelLayout>
            </Route>

            <Route path="/obs/scene" nest>
              <Route path="/master" component={V2ObsSceneMasterPage} />
            </Route>

            <Route>
              <Redirect to="/panel" />
            </Route>
          </Switch>
        </ConfirmDialogProvider>
      </FirebaseDatabaseProvider>
    </QueryClientProvider>
    <ToastContainer />
  </React.StrictMode>
)
