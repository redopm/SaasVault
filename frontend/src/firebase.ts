import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export let analytics: any = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

import { doc, getDoc, setDoc } from 'firebase/firestore';

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // First time Google login - initialize with 25 free credits
      await setDoc(userRef, {
        username: user.displayName || 'User',
        email: user.email,
        createdAt: new Date(),
        isPro: false,
        vault_credits: 25 // 1 Free PDF Export
      });
    }
    
    return user;
  } catch (error) {
    console.error("Firebase Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  return signOut(auth);
};
