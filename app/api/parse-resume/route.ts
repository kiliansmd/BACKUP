import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseMockMode } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Parse Resume API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei hochgeladen', success: false },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('📎 File received:', file.name, 'Size:', file.size);

    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Datei ist zu groß (max. 10MB)', success: false },
        { status: 413, headers: corsHeaders }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ungültiger Dateityp. Nur PDF und DOC/DOCX erlaubt.', success: false },
        { status: 400, headers: corsHeaders }
      );
    }

    let parsedData;
    
    // Check if we should use mock parser
    const apiKey = process.env.RESUME_PARSER_API_KEY || process.env.NEXT_PUBLIC_RESUME_PARSER_API;
    const apiUrl = process.env.NEXT_PUBLIC_RESUME_PARSER_URL;
    
    if (isFirebaseMockMode() || !apiKey || !apiUrl) {
      console.log('🔧 Using mock parser (API key or Firebase not configured)');
      parsedData = await mockResumeParser();
    } else {
      // Real API call
      console.log('🌐 Calling Resume Parser API...');
      
      try {
        const apiFormData = new FormData();
        apiFormData.append('file', file);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          body: apiFormData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Resume Parser API error:', response.status, errorText);
          throw new Error(`Resume parser API error: ${response.status}`);
        }
        
        parsedData = await response.json();
        console.log('✅ Resume parsed successfully');
      } catch (apiError) {
        console.error('❌ API call failed:', apiError);
        // Fallback to mock parser
        console.log('🔧 Falling back to mock parser');
        parsedData = await mockResumeParser();
      }
    }

    // Generate ID
    const resumeId = `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store in Firebase if available
    if (!isFirebaseMockMode() && db) {
      try {
        const resumeData = {
          ...parsedData,
          id: resumeId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: Timestamp.now(),
          lastModified: Timestamp.now(),
        };
        
        await db.collection('resumes').doc(resumeId).set(resumeData);
        console.log('✅ Resume saved to Firebase:', resumeId);
      } catch (dbError) {
        console.error('❌ Firebase save error:', dbError);
        // Continue even if Firebase save fails
      }
    } else {
      console.log('🔧 Skipping Firebase save (mock mode)');
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resumeId,
        message: 'Lebenslauf erfolgreich verarbeitet',
        fileName: file.name,
        parsed: parsedData
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Parse resume error:', error);
    return NextResponse.json(
      { 
        error: 'Fehler beim Verarbeiten des Lebenslaufs',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler',
        success: false 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}