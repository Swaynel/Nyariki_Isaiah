import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { ContactFormData } from '@/src/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
auth = getAuth(app);

/**
 * Initialize anonymous authentication
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error('Authentication initialization failed:', error);
    throw new Error('Failed to initialize authentication');
  }
};

/**
 * Save contact form submission to Firestore
 */
export const saveContact = async (contactData: ContactFormData): Promise<string> => {
  try {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      await initializeAuth();
    }
    
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...contactData,
      timestamp: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

export { db, auth };
