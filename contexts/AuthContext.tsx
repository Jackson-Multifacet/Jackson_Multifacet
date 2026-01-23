import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  assignRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Auth not initialized. Check Firebase config.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch Role from Firestore
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
          avatar: firebaseUser.photoURL || 'https://via.placeholder.com/100'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      alert("Firebase is not initialized. Please check your API keys in the configuration.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const assignRole = async (role: UserRole) => {
    if (!user || !role) return;
    
    await DbService.setUserRole(
      user.uid, 
      role, 
      user.name, 
      user.email, 
      user.avatar
    );
    
    // Update local state immediately for better UX
    setUser(prev => prev ? ({ ...prev, role }) : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, assignRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};