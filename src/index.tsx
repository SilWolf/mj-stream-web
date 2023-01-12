/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import FirebaseDatabaseProvider from './providers/firebaseDatabase.provider'

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

ReactDOM.render(
  <React.StrictMode>
    <FirebaseDatabaseProvider>
      <App />
    </FirebaseDatabaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
