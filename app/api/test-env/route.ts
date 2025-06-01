import { NextResponse } from 'next/server';
import { getFirebaseStatus } from '@/lib/firebase-admin';

export async function GET() {
  // Sicherheitscheck für Production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    
    // Firebase Status
    firebase: {
      ...getFirebaseStatus(),
      projectIdSet: !!process.env.FIREBASE_PROJECT_ID,
      clientEmailSet: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKeySet: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: isDevelopment ? process.env.FIREBASE_PRIVATE_KEY?.length : 'hidden',
    },
    
    // Resume Parser Status
    resumeParser: {
      apiKeySet: !!process.env.RESUME_PARSER_API_KEY,
      publicApiKeySet: !!process.env.NEXT_PUBLIC_RESUME_PARSER_API,
      urlSet: !!process.env.NEXT_PUBLIC_RESUME_PARSER_URL,
      url: process.env.NEXT_PUBLIC_RESUME_PARSER_URL || 'not set',
    },
    
    // Vercel KV Status
    vercelKV: {
      urlSet: !!process.env.KV_URL,
      restApiUrlSet: !!process.env.KV_REST_API_URL,
      tokenSet: !!process.env.KV_REST_API_TOKEN,
    },
    
    // Environment Keys (nur in Development)
    allEnvKeys: isDevelopment ? 
      Object.keys(process.env)
        .filter(key => 
          key.includes('FIREBASE') || 
          key.includes('RESUME') || 
          key.includes('NEXT_PUBLIC') ||
          key.includes('KV')
        )
        .sort() : 
      'hidden in production',
      
    // System Status
    systemStatus: {
      firebaseReady: !!process.env.FIREBASE_PROJECT_ID && 
                    !!process.env.FIREBASE_CLIENT_EMAIL && 
                    !!process.env.FIREBASE_PRIVATE_KEY,
      resumeParserReady: !!process.env.RESUME_PARSER_API_KEY && 
                        !!process.env.NEXT_PUBLIC_RESUME_PARSER_URL,
      mockMode: !process.env.FIREBASE_PROJECT_ID || !process.env.RESUME_PARSER_API_KEY
    }
  });
}