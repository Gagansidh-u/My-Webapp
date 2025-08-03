import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAak40wl54A2kaSyxfFN5xiOShY3oPg6Ns",
  authDomain: "grock-fun-63159.firebaseapp.com",
  projectId: "grock-fun-63159",
  storageBucket: "grock-fun-63159.firebasestorage.app",
  messagingSenderId: "513451391473",
  appId: "1:513451391473:web:8d75c1ffab5aa2962a6c50",
  measurementId: "G-Q9FD6NHF7G"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
