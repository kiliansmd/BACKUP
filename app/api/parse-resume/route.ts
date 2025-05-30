import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseMockMode } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Konfiguration für die Route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Mock Parser für Development
const mockResumeParser = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    name: "Test Kandidat",
    title: "Software Developer",
    brief: "Erfahrener Entwickler mit 5+ Jahren Erfahrung",
    contact: {
      email: "test@example.com",
      phone: "+49 123 456789",
      location_city: "Berlin",
      location_country: "Germany"
    },
    skills: ["TypeScript", "React", "Node.js"],
    derived: {
      years_of_experience: 5
    }
  };
};

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS handler für CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei hochgeladen' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Datei ist zu groß (max. 10MB)' },
        { status: 413, headers: corsHeaders }
      );
    }

    let parsedData;
    
    // Check if we should use mock parser
    if (isFirebaseMockMode() || !process.env.RESUME_PARSER_API_KEY) {
      console.log('🔧 Using mock parser');
      parsedData = await mockResumeParser();
    } else {
      // Real API call
      const apiFormData = new FormData();
      apiFormData.append('file', file);
      
      const response = await fetch(process.env.NEXT_PUBLIC_RESUME_PARSER_URL || 'https://resumeparser.app/resume/parse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESUME_PARSER_API_KEY}`
        },
        body: apiFormData,
      });
      
      if (!response.ok) {
        throw new Error(`Resume parser API error: ${response.status}`);
      }
      
      parsedData = await response.json();
    }

    // Generate ID
    const resumeId = `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store in Firebase if available
    if (!isFirebaseMockMode() && db) {
      const resumeData = {
        ...parsedData,
        id: resumeId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: Timestamp.now(),
        lastModified: Timestamp.now(),
      };
      
      await db.collection('resumes').doc(resumeId).set(resumeData);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resumeId,
        message: 'Lebenslauf erfolgreich verarbeitet'
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Parse resume error:', error);
    return NextResponse.json(
      { 
        error: 'Fehler beim Verarbeiten des Lebenslaufs',
        success: false 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
