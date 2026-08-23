import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Load the configuration from the .env file
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize Firebase (ensuring it only initializes once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Authentication with AsyncStorage so users stay logged in when they close the app
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// 4. Initialize Firestore
// Note: true offline persistence (persistentLocalCache) requires IndexedDB which isn't supported in React Native natively.
// We explicitly use memoryLocalCache to silence the warning.
const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});

// 5. Initialize Storage (for uploading recipe images later)
const storage = getStorage(app);

export { app, auth, db, storage };