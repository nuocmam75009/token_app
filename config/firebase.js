import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://token-io-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};


// Init Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Init Google Auth Provider
const googleProvider = new GoogleAuthProvider();


export { app, db, auth, googleProvider };