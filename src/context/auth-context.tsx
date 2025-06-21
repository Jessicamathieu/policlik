
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    // onAuthStateChanged, 
    // signInWithEmailAndPassword, 
    // signOut as firebaseSignOut, 
    type User 
} from 'firebase/auth';
// import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- DEVELOPMENT MODE ---
  // This block automatically logs in a mock user to bypass the login screen.
  // To re-enable real Firebase authentication:
  // 1. Comment out or delete this entire "DEVELOPMENT MODE" section.
  // 2. Uncomment the "PRODUCTION MODE" section below.
  // 3. Uncomment the firebase imports at the top of the file.
  useEffect(() => {
    console.warn("ATTENTION : Le mode développeur est activé. L'authentification est contournée.");
    setUser({
      uid: 'dev-user-01',
      email: 'dev@policlik.com',
      displayName: 'Développeur',
      photoURL: null,
    } as User);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    toast({ title: "Mode Développeur", description: "Connexion automatique. Redirection en cours..." });
    return Promise.resolve();
  };

  const signOut = async (): Promise<void> => {
    toast({ title: "Mode Développeur", description: "La déconnexion est désactivée pour rester sur les pages protégées." });
    return Promise.resolve();
  };
  // --- END DEVELOPMENT MODE ---

  /*
  // --- PRODUCTION MODE ---
  // To use real Firebase authentication, uncomment this section.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };
  // --- END PRODUCTION MODE ---
  */
  
  const value = { user, loading, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
