import { NextResponse } from 'next/server';
import { getResumes } from '@/lib/firebase';
import { withErrorHandling, withRateLimit } from '@/lib/api-middleware';
import { createApiResponse } from '@/utils/validation';

export const GET = withRateLimit(100, 60000)(
  withErrorHandling(async (request: Request) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const seniority = searchParams.get('seniority') || '';
    const skills = searchParams.get('skills') || '';

    const result = await getResumes({
      page,
      limit,
      search,
      location,
      seniority,
      skills
    });

    return NextResponse.json(createApiResponse(result));
  })
); 