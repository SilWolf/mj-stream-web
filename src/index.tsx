/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch } from 'wouter'
import './index.css'
import reportWebVitals from './reportWebVitals'
import FirebaseDatabaseProvider from './providers/firebaseDatabase.provider'

import IndexPage from './pages/index.page'
import MatchDetailPage from './pages/match/[id]/index.page'
import MatchOBSPage from './pages/match/[id]/obs.page'
import MatchControlPage from './pages/match/[id]/control.page'
import DevPage from './pages/dev/index.page'
import PlayersPage from './pages/players/index.page'
import PlayersDetailPage from './pages/players/[id]/index.page'
import ConfirmDialogProvider from './components/ConfirmDialog/provider'
import TestForScoreSelectPage from './pages/test/score-select.page'
import TestForDialogPage from './pages/test/dialog'
import CreateMatchPage from './pages/create-match/index.page'

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

ReactDOM.render(
  <React.StrictMode>
    <FirebaseDatabaseProvider>
      <ConfirmDialogProvider>
        <Switch>
          <Route path="/" component={IndexPage} />
          <Route path="/create-match" component={CreateMatchPage} />
          <Route path="/dev" component={DevPage} />
          <Route path="/match/:matchId" component={MatchDetailPage} />
          <Route path="/match/:matchId/obs" component={MatchOBSPage} />
          <Route path="/match/:matchId/control" component={MatchControlPage} />
          <Route path="/players" component={PlayersPage} />
          <Route path="/players/:playerId" component={PlayersDetailPage} />
          <Route path="/test/score-select" component={TestForScoreSelectPage} />
          <Route path="/test/dialog" component={TestForDialogPage} />
        </Switch>
      </ConfirmDialogProvider>
    </FirebaseDatabaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
