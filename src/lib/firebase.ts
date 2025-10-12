
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAak40wl54A2kaSyxfFN5xiOShY3oPg6Ns",
  authDomain: "grock-fun-63159.firebaseapp.com",
  databaseURL: "https://grock-fun-63159-default-rtdb.firebaseio.com",
  projectId: "grock-fun-63159",
  storageBucket: "grock-fun-63159.appspot.com",
  messagingSenderId: "513451391473",
  appId: "1:513451391473:web:8d75c1ffab5aa2962a6c50",
  measurementId: "G-Q9FD6NHF7G",
};


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
