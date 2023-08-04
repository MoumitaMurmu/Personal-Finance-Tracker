// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbii7oPvqulphyidD_DPr6BPYKXjnafdk",
  authDomain: "personal-finance-tracker-b8416.firebaseapp.com",
  projectId: "personal-finance-tracker-b8416",
  storageBucket: "personal-finance-tracker-b8416.appspot.com",
  messagingSenderId: "578138417691",
  appId: "1:578138417691:web:a285125cb70335b02766be",
  measurementId: "G-TPXYF4L7VR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc}; 
