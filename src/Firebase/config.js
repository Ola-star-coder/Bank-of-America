// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPOaO6czq4tvBZptJPQOO_ooXYiNGr8dA",
  authDomain: "bank-app-1c360.firebaseapp.com",
  projectId: "bank-app-1c360",
  storageBucket: "bank-app-1c360.firebasestorage.app",
  messagingSenderId: "263886684224",
  appId: "1:263886684224:web:f359b5dd094162f898dfa5",
  measurementId: "G-Q0Z36VE14X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
