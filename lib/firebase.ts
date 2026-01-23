import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Go to Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "", 
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "", 
  projectId: process.env.FIREBASE_PROJECT_ID || "", 
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || ""
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = apps[0];
    }
    
    if (app) {
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        console.log("Firebase services initialized successfully");
    }
  } else {
    console.warn("Firebase config missing. Some features may not work.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, db, auth, storage };