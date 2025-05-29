import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { withErrorHandling, withRateLimit } from '@/lib/api-middleware';
import { fileUploadSchema, resumeSchema, createApiResponse } from '@/utils/validation';
import { revalidateTag } from 'next/cache';

// Development mock function
const mockResumeParser = async (file: File) => {
  console.log('🔧 Development mode: Using mock resume parser for file:', file.name);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock parsed data
  return {
    name: "Max Mustermann",
    title: "Software Developer",
    brief: "Erfahrener Entwickler mit 5+ Jahren Erfahrung in TypeScript und React.",
    contact: {
      email: "max.mustermann@example.com",
      phone: "+49 123 456789",
      location_city: "Berlin",
      location_country: "Germany"
    },
    employment_history: [
      {
        company: "Tech Corp GmbH",
        position: "Senior Developer",
        startDate: "2020-01",
        endDate: "Present",
        description: ["Frontend development with React", "Backend APIs with Node.js"]
      }
    ],
    education: [
      {
        institution: "TU Berlin",
        degree: "Bachelor of Science",
        area: "Computer Science",
        startDate: "2015-10",
        endDate: "2019-09"
      }
    ],
    skills: ["TypeScript", "React", "Node.js", "Firebase", "Next.js"],
    languages: ["German", "English"],
    derived: {
      years_of_experience: 5,
      approximate_age: 28
    }
  };
};

export const POST = withRateLimit(10, 60000)( // Max 10 uploads per minute
  withErrorHandling(async (request: Request) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validiere die Datei
    await fileUploadSchema.parseAsync({ file });

    let parsedData;

    // Check if we're in development mode with dummy API key
    if (process.env.NODE_ENV === 'development' && 
        (!process.env.RESUME_PARSER_API_KEY || 
         process.env.RESUME_PARSER_API_KEY === 'dummy-api-key-for-development')) {
      
      // Use mock parser in development
      parsedData = await mockResumeParser(file);
      
    } else {
      // Use real API in production or with real API key
      if (!process.env.RESUME_PARSER_API_KEY) {
        throw new Error('RESUME_PARSER_API_KEY is not defined in environment variables');
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Parse resume mit externem Service
      const response = await fetch('https://resumeparser.app/resume/parse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESUME_PARSER_API_KEY}`
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error(`Resume parser API error: ${response.status}`);
      }

      parsedData = await response.json();
    }

    // Validiere die geparsten Daten
    let validatedData;
    try {
      validatedData = await resumeSchema.parseAsync(parsedData);
    } catch (validationError) {
      console.warn('Parsed data validation warning:', validationError);
      validatedData = parsedData; // Verwende ungültige Daten mit Warnung
    }

    // Speichere in Firebase mit zusätzlichen Metadaten (nur wenn nicht im Development Mock-Modus)
    if (process.env.NODE_ENV !== 'development' || 
        process.env.FIREBASE_PROJECT_ID !== 'cv-parser-dev') {
      
      const resumeData = {
        ...validatedData,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: Timestamp.now(),
        lastModified: Timestamp.now(),
        version: 1,
        status: 'active',
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        }
      };

      const resumeRef = await db.collection('resumes').add(resumeData);

      // Invalidiere den Cache
      revalidateTag('resume');

      return NextResponse.json(
        createApiResponse({
          id: resumeRef.id,
          message: 'Resume parsed and stored successfully',
          warnings: validatedData !== parsedData ? ['Some fields did not pass validation'] : []
        })
      );
    } else {
      // Development mode - return mock response without saving to Firebase
      console.log('🔧 Development mode: Skipping Firebase storage');
      
      return NextResponse.json(
        createApiResponse({
          id: 'dev-mock-id-' + Date.now(),
          message: 'Resume parsed successfully (development mode)',
          data: validatedData,
          warnings: ['Development mode: Data not saved to Firebase']
        })
      );
    }
  })
);