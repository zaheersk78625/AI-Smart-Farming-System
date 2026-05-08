import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, messaging } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  requestNotificationPermission: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const requestNotificationPermission = async () => {
    if (!messaging) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BIsS_6A-uP8P7c2A_ZlqQWv6j3d_y5bZx0qE_8g8j8j8j8j8j8j8j8j8j8j8j8j8j8j8j8j8j8j8j' // Placeholder - typically from dashboard
        });
        
        if (token && user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            fcmTokens: arrayUnion(token)
          });
          console.log('FCM Token registered');
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: 'farmer',
            fcmTokens: [],
            notificationPrefs: { push: true, email: true, sms: false },
            createdAt: new Date().toISOString()
          });
        }
        
        // Setup foreground message listener
        if (messaging) {
          onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            // In a real app, we'd show a toast here
          });
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // These codes represent the user cancelling or another popup being active.
      // We silence them to avoid cluttering logs with expected behavior.
      const silentCodes = ['auth/cancelled-popup-request', 'auth/popup-closed-by-user', 'auth/cancelled-popup-request'];
      if (!silentCodes.includes(error?.code)) {
        console.error("Sign in error:", error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSigningIn, signIn, logOut, requestNotificationPermission }}>
      {!loading && children}
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
