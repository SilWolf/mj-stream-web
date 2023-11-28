import firebaseApp from '@/firebaseApp'
import { getRandomId } from '@/utils/string.util'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const firebaseStorage = getStorage(firebaseApp)

export const uploadImage = (file: File, filename?: string) => {
  const myFilename = filename ?? `images/uploads/ungroup/image_${getRandomId()}`
  const newFileRef = ref(firebaseStorage, myFilename)

  return uploadBytes(newFileRef, file).then(async (snapshot) => ({
    url: await getDownloadURL(snapshot.ref),
  }))
}
