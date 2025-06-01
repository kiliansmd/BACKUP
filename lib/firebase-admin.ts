import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | null = null;

function initializeFirebase() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Development mode - use mock data
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('🔧 Firebase credentials missing - using mock mode');
    console.warn('🔧 Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to use Firebase');
    return null;
  }

  try {
    // Fix private key format - handle both escaped and unescaped newlines
    const formattedPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/^\"|\"$/g, ''); // Remove surrounding quotes if present
    
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
      projectId, // Explicitly set project ID
    });
    
    console.log('✅ Firebase Admin initialized successfully');
    console.log('✅ Project ID:', projectId);
    return app;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    console.error('❌ Please check your Firebase credentials');
    return null;
  }
}

// Initialize on module load
const firebaseApp = initializeFirebase();

// Export database instance or null for mock mode
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

// Helper to check if we're in mock mode
export const isFirebaseMockMode = () => !firebaseApp || !db;

// Export for debugging
export const getFirebaseStatus = () => ({
  initialized: !!firebaseApp,
  mockMode: isFirebaseMockMode(),
  projectId: process.env.FIREBASE_PROJECT_ID || 'not-set',
  hasCredentials: !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  )
});