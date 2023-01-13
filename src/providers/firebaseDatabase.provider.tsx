/* eslint-disable import/no-extraneous-dependencies */
import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'

import { initializeApp } from 'firebase/app'
import {
  Database as FirebaseDatabase,
  getDatabase,
  ref as fbRef,
  get as fbGet,
  set as fbSet,
  update as fbUpdate,
  onValue as fbOnValue,
  ListenOptions as fbListenOptions,
} from 'firebase/database'

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
  database: FirebaseDatabase
  get: <T extends Record<string, unknown>>(
    key: string
  ) => Promise<T | undefined>
  set: (key: string, payload: unknown) => Promise<void>
  update: (key: string, payload: unknown) => Promise<void>
}

const contextDefaultValue = {
  database: firebaseDatabase,
  get: <T extends Record<string, unknown>>(
    key: string
  ): Promise<T | undefined> => {
    const ref = fbRef(firebaseDatabase, key)
    return fbGet(ref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val() as T
        }
        return undefined
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  },
  set: (key: string, payload: unknown) => {
    const ref = fbRef(firebaseDatabase, key)
    return fbSet(ref, payload).catch((error) => {
      console.error(error)
      throw error
    })
  },
  update: (key: string, payload: unknown) => {
    const ref = fbRef(firebaseDatabase, key)
    return fbUpdate(ref, payload as object).catch((error) => {
      console.error(error)
      throw error
    })
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
  return useContext(FirebaseDatabaseContext)
}

export const useFirebaseDatabaseByKey = <T extends Record<string, unknown>>(
  key: string,
  options?: fbListenOptions
) => {
  const { database } = useContext(FirebaseDatabaseContext)
  const ref = useMemo(() => fbRef(database, key), [database, key])

  const [data, setData] = useState<T>()

  const set = useCallback(
    (payload: T) => {
      return fbSet(ref, payload)
    },
    [ref]
  )

  const update = useCallback(
    (payload: T) => {
      return fbUpdate(ref, payload)
    },
    [ref]
  )

  useEffect(() => {
    if (options?.onlyOnce) {
      fbGet(ref).then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val())
        }
      })
    } else {
      fbOnValue(
        ref,
        (snapshot) => {
          setData(snapshot.val())
        },
        options ?? {}
      )
    }
  }, [options, ref])

  return { data, set, update }
}
