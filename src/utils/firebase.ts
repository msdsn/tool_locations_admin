import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGp35IdBh_PKx-HWIFO_PJQElUG5HI1-k",
  authDomain: "sharepatientlocation2.firebaseapp.com",
  projectId: "sharepatientlocation2",
  storageBucket: "sharepatientlocation2.appspot.com",
  messagingSenderId: "237759655600",
  appId: "1:237759655600:web:17662bea2be78cd03fd575"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };