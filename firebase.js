// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1I3RuP6_tNdJMwtk-T48O6ozDJyPow8k",
  authDomain: "mobilegame-ab611.firebaseapp.com",
  projectId: "mobilegame-ab611",
  storageBucket: "mobilegame-ab611.appspot.com",
  messagingSenderId: "420438304460",
  appId: "1:420438304460:web:fcc9b8726576c2cc0e4469",
  measurementId: "G-RH10D6K2WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app)
export {app, database}