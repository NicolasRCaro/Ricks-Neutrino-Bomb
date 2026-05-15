import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSslm_ff68H-ttiqgiDbpQHQu1edujb5A",
  authDomain: "apps-fe31c.firebaseapp.com",
  projectId: "apps-fe31c",
  storageBucket: "apps-fe31c.firebasestorage.app",
  messagingSenderId: "321379741797",
  appId: "1:321379741797:web:67d591d93904efcd16d68c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);