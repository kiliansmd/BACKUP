import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { Resume } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use real Firebase data
    console.log('🔥 Using Firebase data');

    const { 
      page = '1',
      limit = '10',
      search = '',
      location = '',
      seniority = '',
      skills = ''
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let query = db.collection('resumes');

    // Get all documents (Firestore doesn't support complex text searches)
    const snapshot = await query.get();

    let resumes: Resume[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply filters
    if (search) {
      resumes = resumes.filter(resume => 
        resume.name?.toLowerCase().includes((search as string).toLowerCase()) ||
        resume.title?.toLowerCase().includes((search as string).toLowerCase())
      );
    }

    if (location) {
      resumes = resumes.filter(resume => 
        resume.contact?.location_city?.toLowerCase().includes((location as string).toLowerCase()) ||
        resume.contact?.location_country?.toLowerCase().includes((location as string).toLowerCase())
      );
    }

    if (seniority) {
      resumes = resumes.filter(resume => 
        resume.senioritaet?.toLowerCase() === (seniority as string).toLowerCase()
      );
    }

    if (skills) {
      const skillsList = (skills as string).toLowerCase().split(',').map(s => s.trim());
      resumes = resumes.filter(resume => 
        resume.skills?.some(skill => 
          skillsList.includes(skill.toLowerCase())
        )
      );
    }

    // Apply pagination
    const start = (pageNum - 1) * limitNum;
    const paginatedResumes = resumes.slice(start, start + limitNum);

    return res.status(200).json({
      success: true,
      data: paginatedResumes,
      total: resumes.length,
      page: pageNum,
      limit: limitNum,
      hasMore: start + limitNum < resumes.length
    });

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
} 