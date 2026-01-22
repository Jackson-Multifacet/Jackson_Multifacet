import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// TODO: REPLACE WITH YOUR FIREBASE CONFIGURATION
// Go to Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "", // e.g. "AIzaSy..."
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "", // e.g. "jackson-multifacet.firebaseapp.com"
  projectId: process.env.FIREBASE_PROJECT_ID || "", // e.g. "jackson-multifacet"
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || ""
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

// We wrap initialization in a safe check to prevent app crashes if keys are missing
// The DbService will detect if `db` is undefined and fall back to simulation mode.
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase config missing. App running in Backend Simulation Mode.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, db };