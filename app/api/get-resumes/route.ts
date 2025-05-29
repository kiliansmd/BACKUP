import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { withErrorHandling, withRateLimit } from '@/lib/api-middleware';
import { searchSchema, createApiResponse } from '@/utils/validation';
import { appConfig } from '@/config/app.config';

// Resume interface for type safety
interface Resume {
  id: string;
  name?: string;
  title?: string;
  fileName?: string;
  uploadedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
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

// Development mock function
const getMockResumes = (): Resume[] => {
  console.log('🔧 Development mode: Using mock resume data');
  
  return [
    {
      id: 'mock-resume-1',
      name: 'Max Mustermann',
      title: 'Senior Software Developer',
      fileName: 'max_mustermann_cv.pdf',
      uploadedAt: {
        _seconds: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
        _nanoseconds: 0
      },
      contact: {
        location_city: 'Berlin',
        location_country: 'Germany',
        email: 'max.mustermann@example.com'
      },
      derived: {
        years_of_experience: 8
      },
      skills: ['TypeScript', 'React', 'Node.js', 'AWS', 'Docker'],
      senioritaet: 'senior'
    },
    {
      id: 'mock-resume-2',
      name: 'Sarah Schmidt',
      title: 'Frontend Developer',
      fileName: 'sarah_schmidt_cv.pdf',
      uploadedAt: {
        _seconds: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
        _nanoseconds: 0
      },
      contact: {
        location_city: 'München',
        location_country: 'Germany'
      },
      derived: {
        years_of_experience: 4
      },
      skills: ['JavaScript', 'Vue.js', 'CSS', 'Figma'],
      senioritaet: 'mid'
    },
    {
      id: 'mock-resume-3',
      name: 'Tom Weber',
      title: 'Junior Full Stack Developer',
      fileName: 'tom_weber_cv.pdf',
      uploadedAt: {
        _seconds: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
        _nanoseconds: 0
      },
      contact: {
        location_city: 'Hamburg',
        location_country: 'Germany'
      },
      derived: {
        years_of_experience: 2
      },
      skills: ['Python', 'Django', 'PostgreSQL', 'Git'],
      senioritaet: 'junior'
    }
  ];
};

export const GET = withRateLimit(100, 60000)(
  withErrorHandling(async (request: Request) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Check if we should use mock data (only when no real Firebase credentials)
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_CLIENT_EMAIL || 
        !process.env.FIREBASE_PRIVATE_KEY) {
      
      console.log('🔧 Development mode: Using mock resume data');
      return NextResponse.json(createApiResponse(getMockResumes()));
    }

    // Use real Firebase data
    console.log('🔥 Using real Firebase data from project:', process.env.FIREBASE_PROJECT_ID);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || appConfig.ui.itemsPerPage.toString());
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const seniority = searchParams.get('seniority') || '';
    const skills = searchParams.get('skills') || '';

    let query = db.collection('resumes');

    // Hole alle Dokumente (Firestore unterstützt keine komplexen Textsuchen)
    const snapshot = await query.get();

    let resumes: Resume[];

    // Parse Search-Parameter
    const searchData = await searchSchema.parseAsync({
      query: searchParams.get('query') || undefined,
      seniority: searchParams.get('seniority') || undefined,
      skills: searchParams.get('skills')?.split(',') || undefined,
      location: searchParams.get('location') || undefined,
      availability: searchParams.get('availability') || undefined,
      minExperience: searchParams.get('minExperience') 
        ? parseInt(searchParams.get('minExperience')!) 
        : undefined,
      maxExperience: searchParams.get('maxExperience') 
        ? parseInt(searchParams.get('maxExperience')!) 
        : undefined,
      sortBy: searchParams.get('sortBy') || 'uploadedAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    });

    resumes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Resume[];

    // Client-seitige Filterung
    if (searchData.query) {
      const searchTerm = searchData.query.toLowerCase();
      resumes = resumes.filter(resume => 
        resume.name?.toLowerCase().includes(searchTerm) ||
        resume.title?.toLowerCase().includes(searchTerm) ||
        resume.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm))
      );
    }

    if (searchData.seniority) {
      resumes = resumes.filter(resume => 
        resume.senioritaet?.toLowerCase() === searchData.seniority
      );
    }

    if (searchData.location) {
      const locationTerm = searchData.location.toLowerCase();
      resumes = resumes.filter(resume => 
        resume.contact?.location_city?.toLowerCase().includes(locationTerm) ||
        resume.contact?.location_country?.toLowerCase().includes(locationTerm)
      );
    }

    if (searchData.skills && searchData.skills.length > 0) {
      resumes = resumes.filter(resume => 
        searchData.skills!.some(skill => 
          resume.skills?.some((resumeSkill: string) => 
            resumeSkill.toLowerCase().includes(skill.toLowerCase())
          )  
        )
      );
    }

    if (searchData.minExperience !== undefined) {
      resumes = resumes.filter(resume => 
        (resume.derived?.years_of_experience || 0) >= searchData.minExperience!
      );
    }

    if (searchData.maxExperience !== undefined) {
      resumes = resumes.filter(resume => 
        (resume.derived?.years_of_experience || 0) <= searchData.maxExperience!
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedResumes = resumes.slice(startIndex, endIndex);

    return NextResponse.json(
      createApiResponse({
        resumes: paginatedResumes,
        pagination: {
          total: resumes.length,
          page,
          limit,
          totalPages: Math.ceil(resumes.length / limit)
        }
      }),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        }
      }
    );
  })
); 