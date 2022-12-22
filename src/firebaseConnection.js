import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2pBI9D3smuyx_u8y935Reg9ukW6To_z8",
  authDomain: "curso-fd563.firebaseapp.com",
  projectId: "curso-fd563",
  storageBucket: "curso-fd563.appspot.com",
  messagingSenderId: "799091972005",
  appId: "1:799091972005:web:104ff2e43bab88cb1fba4c",
  measurementId: "G-TEJ3VXK7RT"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };