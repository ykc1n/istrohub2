import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

//where db is initialized, ill export it so api can use it

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnTaKorGtCRKqSkZLSgDqvkPRCVUwNa_U",
    authDomain: "istrohub.firebaseapp.com",
    projectId: "istrohub",
    storageBucket: "istrohub.firebasestorage.app",
    messagingSenderId: "456398690462",
    appId: "1:456398690462:web:32e0745983d6b8673cc38f",
    measurementId: "G-SQH465K84Z"
  };

  const app = initializeApp(firebaseConfig)

  export const db = getFirestore(app)