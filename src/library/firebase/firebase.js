import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "This will not work",
    authDomain: "Example",
    projectId: "Fake Info",
    storageBucket: "This will not run correctly",
    messagingSenderId: "Please do not try to run this",
    appId: "You wish you knew the app id don't you",
    measurementId: "All made up and the points don't matter"
  };
  
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

if(window.location.hostname === 'localhost'){
  try { 
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  catch (e) {
    console.log(e);
  }
}

if(window.location.hostname === 'localhost'){
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { db, storage, auth };
