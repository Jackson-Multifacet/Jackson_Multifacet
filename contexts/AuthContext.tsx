import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { DbService } from '../services/db';

type UserRole = 'admin' | 'client' | 'candidate' | 'partner' | null;

interface User {
  uid: string;
  name: string;
  email: string | null;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => Promise<void>;
  assignRole: (role: UserRole) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we are in a purely mock environment (no auth), stop loading immediately
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Running in Offline Mode.");
      setLoading(false);
      return;
    }

    // Handle Redirect Result for Google Login
    getRedirectResult(auth).then(async (result) => {
      if (result && db) {
         const userRef = doc(db, 'users', result.user.uid);
         const userDoc = await getDoc(userRef);
         
         if (!userDoc.exists()) {
           await setDoc(userRef, {
             name: result.user.displayName || 'User',
             email: result.user.email,
             photoURL: result.user.photoURL,
             createdAt: Timestamp.now(),
             role: null 
           });
         }
      }
    }).catch((err) => {
      console.error("Redirect login failed", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`DOMAIN_ERROR: ${window.location.hostname}`);
      } else {
        setError(err.message);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role: UserRole = null;
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              role = userDoc.data().role as UserRole;
            }
          } catch (e) {
            console.error("Error fetching user role:", e);
          }
        }

        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          role: role,
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.email}`
        });
      } else {
        // Only clear user if not in demo mode (simple check)
        if (!user || !user.uid.startsWith('demo-')) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  // --- BYPASS FOR SANDBOX ENVIRONMENTS ---
  const loginAsDemoUser = (role: UserRole) => {
    const demoUser: User = {
      uid: `demo-${Date.now()}`,
      name: `Demo ${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'}`,
      email: `demo.${role}@jackson.com`,
      role: role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    };
    setUser(demoUser);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    if (!auth) {
      setError("Authentication service unavailable.");
      return;
    }
    clearError();

    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error("Google Login trigger failed", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`DOMAIN_ERROR: ${window.location.hostname}`);
      } else {
        setError(err.message);
      }
      throw err;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) throw new Error("Authentication service unavailable.");
    clearError();
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });
      
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name,
          email,
          createdAt: Timestamp.now(),
          role: null 
        });
      }
    } catch (err: any) {
      console.error("Signup failed", err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Authentication service unavailable.");
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
    }
  };

  const assignRole = async (role: UserRole) => {
    if (!user || !role) return;
    
    setUser({ ...user, role });
    
    // Only persist if not a demo user
    if (db && !user.uid.startsWith('demo-')) {
      try {
        await DbService.setUserRole(
          user.uid, 
          role, 
          user.name, 
          user.email, 
          user.avatar
        );
      } catch (e) {
        console.error("Could not persist role to backend", e);
        setError("Failed to save role setting. Please try again.");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithGoogle, signupWithEmail, loginWithEmail, loginAsDemoUser, logout, assignRole, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};