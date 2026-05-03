import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCUkCXYtG0NLdtKQHLcvX7MnS10dlyhAn0",
  authDomain: "avora-app-7a0a4.firebaseapp.com",
  databaseURL: "https://avora-app-7a0a4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "avora-app-7a0a4",
  storageBucket: "avora-app-7a0a4.firebasestorage.app",
  messagingSenderId: "44245761127",
  appId: "1:44245761127:web:ca27e54701409bc96268c2"
};

const app = initializeApp(firebaseConfig); 

export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); 
export const realtimeDb = getDatabase(app); 
export const storage = getStorage(app); 

export default app;