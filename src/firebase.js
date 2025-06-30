import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2gZd7ZxzN1kZK68-cs21TArpni7R1iWg",
  authDomain: "isac-och-veronica-recept.firebaseapp.com",
  projectId: "isac-och-veronica-recept",
  storageBucket: "isac-och-veronica-recept.firebasestorage.app",
  messagingSenderId: "698099949303",
  appId: "1:698099949303:web:e5aa5c994dc09ad556fdf2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };