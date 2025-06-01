import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseMockMode } from '@/lib/firebase-admin';

// Mock data for development
const mockResume = {
  id: 'mock-1',
  name: 'Kandidat:in A',
  title: 'Senior Software Developer',
  fileName: 'kandidat_a.pdf',
  uploadedAt: { _seconds: Date.now() / 1000, _nanoseconds: 0 },
  contact: {
    email: 'test@example.com',
    phone: '+49 123 456789',
    location_city: 'Berlin',
    location_country: 'Germany'
  },
  derived: { years_of_experience: 8 },
  skills: ['TypeScript', 'React', 'Node.js', 'Firebase'],
  brief: 'Erfahrener Entwickler mit Fokus auf moderne Web-Technologien',
  employment_history: [
    {
      company: 'Tech Company GmbH',
      position: 'Senior Developer',
      startDate: '2020-01',
      endDate: 'Present',
      description: ['Led development team', 'Implemented microservices']
    }
  ],
  education: [
    {
      institution: 'Technische Universität',
      degree: 'Master of Science',
      area: 'Computer Science',
      graduationDate: '2015'
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('📋 Fetching resume:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID ist erforderlich', success: false },
        { status: 400 }
      );
    }

    let resumeData = null;

    if (isFirebaseMockMode() || !db) {
      // Use mock data in development
      console.log('🔧 Using mock resume data');
      if (id.startsWith('mock-')) {
        resumeData = { ...mockResume, id };
      }
    } else {
      // Fetch from Firebase
      try {
        const docRef = db.collection('resumes').doc(id);
        const doc = await docRef.get();
        
        if (doc.exists) {
          resumeData = { id: doc.id, ...doc.data() };
          console.log('✅ Resume found in Firebase');
        } else {
          console.log('❌ Resume not found in Firebase');
        }
      } catch (firebaseError) {
        console.error('❌ Firebase fetch error:', firebaseError);
        // Fallback to mock data
        if (id.startsWith('mock-')) {
          resumeData = { ...mockResume, id };
        }
      }
    }

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Lebenslauf nicht gefunden', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resumeData
    });

  } catch (error) {
    console.error('❌ Get resume error:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Abrufen des Lebenslaufs',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID ist erforderlich', success: false },
        { status: 400 }
      );
    }

    const data = await request.json();

    if (!isFirebaseMockMode() && db) {
      const docRef = db.collection('resumes').doc(id);
      await docRef.update({
        ...data,
        lastModified: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Lebenslauf erfolgreich aktualisiert'
    });

  } catch (error) {
    console.error('❌ Update resume error:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Aktualisieren des Lebenslaufs',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID ist erforderlich', success: false },
        { status: 400 }
      );
    }

    if (!isFirebaseMockMode() && db) {
      await db.collection('resumes').doc(id).delete();
    }

    return NextResponse.json({
      success: true,
      message: 'Lebenslauf erfolgreich gelöscht'
    });

  } catch (error) {
    console.error('❌ Delete resume error:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Löschen des Lebenslaufs',
        success: false
      },
      { status: 500 }
    );
  }
}