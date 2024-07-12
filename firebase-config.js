import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAUU6PIKQ1_fZNk7IG9-8jQHoCCN9sjmiI",
  authDomain: "medelen-a1ff7.firebaseapp.com",
  projectId: "medelen-a1ff7",
  storageBucket: "medelen-a1ff7.appspot.com",
  messagingSenderId: "50657966995",
  appId: "1:50657966995:web:64ae1af1d1a6e97b7b8666",
  measurementId: "G-1BHNW78BV0",
  databaseURL: "https://medelen-a1ff7-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, db, firestore, storage };

export default app;