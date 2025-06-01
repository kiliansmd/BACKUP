import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseMockMode } from '@/lib/firebase-admin';

// Mock data for development
const mockResumes = [
  {
    id: 'mock-1',
    name: 'Kandidat:in A',
    title: 'Senior Software Developer',
    fileName: 'kandidat_a.pdf',
    uploadedAt: { _seconds: Date.now() / 1000 - 86400, _nanoseconds: 0 },
    contact: {
      location_city: 'Berlin',
      location_country: 'Germany'
    },
    derived: { years_of_experience: 8 },
    skills: ['TypeScript', 'React', 'Node.js'],
    senioritaet: 'senior'
  },
  {
    id: 'mock-2',
    name: 'Kandidat:in B',
    title: 'Frontend Developer',
    fileName: 'kandidat_b.pdf',
    uploadedAt: { _seconds: Date.now() / 1000 - 172800, _nanoseconds: 0 },
    contact: {
      location_city: 'München',
      location_country: 'Germany'
    },
    derived: { years_of_experience: 4 },
    skills: ['JavaScript', 'Vue.js', 'CSS'],
    senioritaet: 'mid'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    console.log('📋 Get resumes - Page:', page, 'Limit:', limit, 'Search:', search);

    let resumes = [];

    if (isFirebaseMockMode() || !db) {
      // Use mock data
      console.log('🔧 Using mock resume data');
      resumes = mockResumes;
    } else {
      // Fetch from Firebase
      try {
        const snapshot = await db.collection('resumes')
          .orderBy('uploadedAt', 'desc')
          .limit(100) // Get more for filtering
          .get();
        
        resumes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('✅ Fetched', resumes.length, 'resumes from Firebase');
      } catch (firebaseError) {
        console.error('❌ Firebase query error:', firebaseError);
        // Fallback to mock data
        resumes = mockResumes;
      }
    }

    // Apply search filter
    if (search) {
      resumes = resumes.filter(resume => 
        resume.name?.toLowerCase().includes(search.toLowerCase()) ||
        resume.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate pagination
    const total = resumes.length;
    const start = (page - 1) * limit;
    const paginatedResumes = resumes.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: {
        resumes: paginatedResumes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get resumes error:', error);
    return NextResponse.json(
      { 
        error: 'Fehler beim Abrufen der Lebensläufe',
        success: false 
      },
      { status: 500 }
    );
  }
}