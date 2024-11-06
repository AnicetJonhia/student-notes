import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBX49HffX2Ba-iI8QZxvZTUoV7LNaS4Bgs",
  authDomain: "test-project-8dbdb.firebaseapp.com",
  projectId: "test-project-8dbdb",
  storageBucket: "test-project-8dbdb.firebasestorage.app",
  messagingSenderId: "1065782984104",
  appId: "1:1065782984104:web:e8924879e9372d81def19d",
  measurementId: "G-RPMJGMDP5Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export  const db = getFirestore(app);

