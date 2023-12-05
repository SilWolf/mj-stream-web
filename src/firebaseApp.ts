import { initializeApp } from 'firebase/app'

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

export default firebaseApp
