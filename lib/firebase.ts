import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if the app is already initialized to avoid multiple instances
const apps = getApps();

if (!apps.length) {
  // Check if we have valid Firebase credentials
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY) {
    
    console.log(`🔥 Initializing Firebase with project: ${process.env.FIREBASE_PROJECT_ID}`);
    
    // Initialize with real Firebase credentials
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } else {
    // Development fallback with dummy config
    console.warn('⚠️ Development mode: Using dummy Firebase configuration');
    
    initializeApp({
      projectId: 'cv-parser-dev',
    });
  }
}

export const db = getFirestore(); 