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
  push as fbPush,
  update as fbUpdate,
  onValue as fbOnValue,
  ListenOptions as fbListenOptions,
  query as fbQuery,
  DatabaseReference,
  limitToLast,
  Query,
  QueryConstraint,
  orderByChild,
} from 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDiuniOaBkqF63lLXun7yFpMTx7VryQOs4',
  authDomain: 'hk-m-league.firebaseapp.com',
  projectId: 'hk-m-league',
  storageBucket: 'hk-m-league.appspot.com',
  messagingSenderId: '624803752404',
  appId: '1:624803752404:web:59c7b94c6655e5fb2a8e41',
  databaseURL:
    'https://hk-m-league-default-rtdb.asia-southeast1.firebasedatabase.app',
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
  push: (key: string, payload: unknown) => Promise<DatabaseReference>
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
  push: (key: string, payload: unknown) => {
    const ref = fbRef(firebaseDatabase, key)
    return fbPush(ref, payload).catch((error) => {
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

export type UseFirebaseDatabaseByKeyOptions = fbListenOptions & {
  order?: {
    byChild?: string
  }
  filter?: {
    limitToLast?: number
  }
}

export const useFirebaseDatabaseByKey = <T extends Record<string, unknown>>(
  key: string,
  options?: UseFirebaseDatabaseByKeyOptions
) => {
  const { database } = useContext(FirebaseDatabaseContext)
  const ref = useMemo(() => {
    return fbRef(database, key)
  }, [database, key])

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
    const queryConstraint: QueryConstraint[] = []

    if (options?.order) {
      if (options.order.byChild) {
        queryConstraint.push(orderByChild(options.order.byChild))
      }
    }

    if (options?.filter) {
      if (typeof options.filter.limitToLast !== 'undefined') {
        queryConstraint.push(limitToLast(options.filter.limitToLast))
      }
    }

    const finalRef: DatabaseReference | Query =
      queryConstraint.length > 0 ? fbQuery(ref, ...queryConstraint) : ref

    if (options?.onlyOnce) {
      fbGet(finalRef).then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val())
        }
      })
    } else {
      fbOnValue(
        finalRef,
        (snapshot) => {
          setData(snapshot.val())
        },
        options ?? {}
      )
    }
  }, [options, ref])

  return { data, set, update }
}
