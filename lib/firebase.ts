import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Define Resume type
export interface Resume {
  id: string;
  name?: string;
  title?: string;
  fileName?: string;
  uploadedAt?: Date | { _seconds: number };
  lastModified?: Date | { _seconds: number };
  version?: number;
  status?: string;
  contact?: {
    location_city?: string;
    location_country?: string;
    email?: string;
  };
  derived?: {
    years_of_experience?: number;
  };
  skills?: string[];
  senioritaet?: string;
}

// Verbesserte Fehlerbehandlung für Umgebungsvariablen
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      'Please check your .env.local file or Vercel environment variables.'
    );
  }
  return value;
};

// Singleton pattern für Firebase-Admin
class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: App;
  private _db: Firestore;

  private constructor() {
    try {
      const projectId = getRequiredEnvVar('FIREBASE_PROJECT_ID');
      const clientEmail = getRequiredEnvVar('FIREBASE_CLIENT_EMAIL');
      const privateKey = getRequiredEnvVar('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n')
        .replace(/\n/g, '\n');

      if (getApps().length === 0) {
        this.app = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey
          })
        });
        console.log('✅ Firebase initialized successfully');
      } else {
        this.app = getApps()[0];
      }

      this._db = getFirestore(this.app);
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
      throw new Error(
        'Failed to initialize Firebase. ' +
        'Please check your Firebase credentials and environment variables.\n' +
        (error instanceof Error ? error.message : String(error))
      );
    }
  }

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  public get db(): Firestore {
    return this._db;
  }
}

// Export Firestore instance
export const db = FirebaseAdmin.getInstance().db;

// Verbesserte Error-Handling für Firestore-Operationen
const handleFirestoreError = (error: unknown, operation: string): never => {
  console.error(`❌ Firestore ${operation} error:`, error);
  throw new Error(
    `Failed to ${operation} in Firestore. ` +
    (error instanceof Error ? error.message : String(error))
  );
};

// Export helper functions with improved error handling
export const getResume = async (id: string): Promise<Resume | null> => {
  try {
    const docRef = db.collection('resumes').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Resume;
  } catch (error) {
    return handleFirestoreError(error, 'get resume');
  }
};

export interface PaginationResult {
  data: Resume[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export const getResumes = async (options: { 
  page?: number; 
  limit?: number; 
  search?: string;
  location?: string;
  seniority?: string;
  skills?: string;
} = {}): Promise<PaginationResult> => {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    location = '', 
    seniority = '',
    skills = ''
  } = options;

  try {
    let query = db.collection('resumes');
    const snapshot = await query.get();
    let resumes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?._seconds ? {
        _seconds: doc.data().uploadedAt._seconds
      } : undefined
    })) as Resume[];

    // Apply filters
    if (search) {
      resumes = resumes.filter(resume => 
        resume.name?.toLowerCase().includes(search.toLowerCase()) ||
        resume.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      resumes = resumes.filter(resume => 
        resume.contact?.location_city?.toLowerCase().includes(location.toLowerCase()) ||
        resume.contact?.location_country?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (seniority) {
      resumes = resumes.filter(resume => 
        resume.senioritaet?.toLowerCase() === seniority.toLowerCase()
      );
    }

    if (skills) {
      const skillsList = skills.toLowerCase().split(',').map(s => s.trim());
      resumes = resumes.filter(resume => 
        resume.skills?.some(skill => 
          skillsList.includes(skill.toLowerCase())
        )
      );
    }

    // Calculate total pages
    const total = resumes.length;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedResumes = resumes.slice(start, start + limit);

    return {
      data: paginatedResumes,
      total,
      page,
      limit,
      hasMore: start + limit < total,
      totalPages
    };
  } catch (error) {
    return handleFirestoreError(error, 'get resumes');
  }
};

export const createResume = async (data: Partial<Resume>): Promise<string> => {
  const resumeRef = await db.collection('resumes').add({
    ...data,
    uploadedAt: new Date(),
    lastModified: new Date(),
    version: 1,
    status: 'active'
  });
  return resumeRef.id;
};

export const updateResume = async (id: string, data: Partial<Resume>): Promise<boolean> => {
  const docRef = db.collection('resumes').doc(id);
  await docRef.update({
    ...data,
    lastModified: new Date()
  });
  return true;
};

export const deleteResume = async (id: string): Promise<boolean> => {
  await db.collection('resumes').doc(id).delete();
  return true;
}; 