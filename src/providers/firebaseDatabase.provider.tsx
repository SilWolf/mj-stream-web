/* eslint-disable import/no-extraneous-dependencies */
import React, { createContext, useContext, PropsWithChildren } from 'react'

import { initializeApp } from 'firebase/app'
import { Database, getDatabase } from 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDiuniOaBkqF63lLXun7yFpMTx7VryQOs4',
  authDomain: 'hk-m-league.firebaseapp.com',
  projectId: 'hk-m-league',
  storageBucket: 'hk-m-league.appspot.com',
  messagingSenderId: '624803752404',
  appId: '1:624803752404:web:59c7b94c6655e5fb2a8e41',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const firebaseDatabase = getDatabase(firebaseApp)

type FirebaseDatabaseContextProps = {
  instance: Database
  getData: () => void
  setData: () => void
}

const contextDefaultValue = {
  instance: firebaseDatabase,
  getData: () => {
    throw new Error('Not Implemented')
  },
  setData: () => {
    throw new Error('Not Implemented')
  },
}

const FirebaseDatabaseContext =
  createContext<FirebaseDatabaseContextProps>(contextDefaultValue)

export default function FirebaseDatabaseProvider({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <FirebaseDatabaseContext.Provider value={contextDefaultValue}>
      {children}
    </FirebaseDatabaseContext.Provider>
  )
}

export const useFirebaseDatabase = () => {
  const context = useContext(FirebaseDatabaseContext)
  return context
}
