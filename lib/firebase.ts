// @ts-ignore
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// @ts-ignore
import { getAnalytics } from 'firebase/analytics';

// Live Firebase Configuration for Jackson Multifacet
const firebaseConfig = {
  apiKey: "AIzaSyDyC1t5oMFCTZyh7u_Q_y9ZkeinmRBZL-I",
  authDomain: "jackson-multifacet.firebaseapp.com",
  projectId: "jackson-multifacet",
  storageBucket: "jackson-multifacet.firebasestorage.app",
  messagingSenderId: "285810215421",
  appId: "1:285810215421:web:147dd86abd7a850177b194",
  measurementId: "G-VLQG6Y6402"
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;
let analytics: any | undefined;

try {
  // Prevent multiple initializations
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  if (app) {
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app);
      
      // Analytics is only supported in browser environments
      if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
      }
      
      console.log("Firebase initialized successfully (Live Mode).");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { app, db, auth, storage, analytics };