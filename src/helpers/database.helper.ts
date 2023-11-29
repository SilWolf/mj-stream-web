import firebaseApp from '@/firebaseApp'
import { Player } from '@/models'
import { getRandomId } from '@/utils/string.util'

import {
  collection,
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

  return result as Player[]
}

export const createPlayerToDatabase = async (player: Player) => {
  const completedPlayer: Player = {
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

export const updatePlayerToDatabase = async (id: string, player: Player) => {
  const completedPlayer: Player = {
    ...player,
    updatedAt: new Date().getTime(),
  }

  await setDoc(
    doc(db, 'players', completedPlayer.id as string),
    completedPlayer
  )

  return completedPlayer
}
