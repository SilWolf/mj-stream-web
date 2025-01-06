import firebaseApp from '@/firebaseApp'
import { RealtimePlayer } from '@/models'
import { getRandomId } from '@/utils/string.util'

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export const getPlayersFromDatabase = async () => {
  const result = await getDocs(collection(db, 'players'))
    .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
    .catch(console.log)

  return result as RealtimePlayer[]
}

export const createPlayerToDatabase = async (player: RealtimePlayer) => {
  const completedPlayer: RealtimePlayer = {
    ...player,
    id: getRandomId(),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }

  await setDoc(
    doc(db, 'players', completedPlayer.id as string),
    completedPlayer
  )

  return completedPlayer
}

export const updatePlayerToDatabase = async (
  id: string,
  player: RealtimePlayer
) => {
  const completedPlayer: RealtimePlayer = {
    ...player,
    updatedAt: new Date().getTime(),
  }

  await setDoc(
    doc(db, 'players', completedPlayer.id as string),
    completedPlayer
  )

  return completedPlayer
}
export const deletePlayerFromDatabase = async (id: string) => {
  await deleteDoc(doc(db, 'players', id))

  return true
}
