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
  connectDatabaseEmulator,
  equalTo,
} from 'firebase/database'
import { isObjectEqual } from '@/utils/object.util'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCa4jaiAOgH5H8B6hSo4DU49WnkpGPeavA',
  authDomain: 'hkmjbs-streaming.firebaseapp.com',
  databaseURL:
    'https://hkmjbs-streaming-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'hkmjbs-streaming',
  storageBucket: 'hkmjbs-streaming.appspot.com',
  messagingSenderId: '537815456325',
  appId: '1:537815456325:web:c387796326f9db2726a12c',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const firebaseDatabase = getDatabase(firebaseApp)
if (window.location.hostname === 'localhost') {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(firebaseDatabase, 'localhost', 9000)
}

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
    equalTo?: string | number | boolean | null
  }
}

export const useFirebaseDatabaseByKey = <
  T extends Record<string, unknown> | string,
  UData extends Record<string, unknown> = Record<string, T>,
  U extends Record<string, unknown> = Record<string, Partial<T>>,
>(
  key: string,
  options?: UseFirebaseDatabaseByKeyOptions
) => {
  const { database } = useContext(FirebaseDatabaseContext)
  const ref = useMemo(() => {
    return fbRef(database, key)
  }, [database, key])

  const [rawData, setRawData] = useState<UData>()
  const [lastOptions, setLastOptions] = useState<
    UseFirebaseDatabaseByKeyOptions | undefined
  >(options)

  const set = useCallback(
    (payload: U) => {
      return fbSet(ref, payload)
    },
    [ref]
  )

  const update = useCallback(
    (payload: U) => {
      return fbUpdate(ref, payload)
    },
    [ref]
  )

  const push = useCallback(
    (payload: T) => {
      return fbPush(ref, payload)
    },
    [ref]
  )

  useEffect(() => {
    if (!isObjectEqual(options, lastOptions)) {
      setLastOptions(options)
    }
  }, [lastOptions, options])

  useEffect(() => {
    const queryConstraint: QueryConstraint[] = []

    if (lastOptions?.order) {
      if (lastOptions.order.byChild) {
        queryConstraint.push(orderByChild(lastOptions.order.byChild))
      }
    }

    if (lastOptions?.filter) {
      if (typeof lastOptions.filter.equalTo !== 'undefined') {
        queryConstraint.push(equalTo(lastOptions.filter.equalTo))
      }

      if (typeof lastOptions.filter.limitToLast !== 'undefined') {
        queryConstraint.push(limitToLast(lastOptions.filter.limitToLast))
      }
    }

    const finalRef: DatabaseReference | Query =
      queryConstraint.length > 0 ? fbQuery(ref, ...queryConstraint) : ref

    if (lastOptions?.onlyOnce) {
      fbGet(finalRef).then((snapshot) => {
        if (snapshot.exists()) {
          setRawData(snapshot.val())
        }
      })
    } else {
      fbOnValue(
        finalRef,
        (snapshot) => {
          setRawData(snapshot.val())
        },
        lastOptions ?? {}
      )
    }
  }, [lastOptions, ref])

  const returnData = useMemo(() => {
    return rawData
  }, [rawData])

  return { data: returnData, set, update, push }
}
