// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getfirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6hgYrJu2ILq2u2N6dG0xP7oUBCRBRgNI",
  authDomain: "token-io.firebaseapp.com",
  databaseURL: "https://token-io-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "token-io",
  storageBucket: "token-io.appspot.com",
  messagingSenderId: "88563639982",
  appId: "1:88563639982:web:1da43ff887fb6f96de2f3f",
  measurementId: "G-Z9GZFF4LW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getfirestore(app);


// to bypass eslint unused var error
db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
    })