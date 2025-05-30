// app/api/resume/[id]/route.ts
import { NextResponse } from 'next/server';
import { getResume, updateResume, deleteResume } from '@/lib/firebase';
import { withErrorHandling, withRateLimit } from '@/lib/api-middleware';
import { createApiResponse } from '@/utils/validation';

export const GET = withRateLimit(100, 60000)(
  withErrorHandling(async (request: Request, context?: Record<string, unknown>) => {
    const params = await (context as any)?.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        createApiResponse(null, false),
        { status: 400 }
      );
    }

    const resumeData = await getResume(id);
    
    if (!resumeData) {
      return NextResponse.json(
        createApiResponse({ error: 'Resume not found' }, false),
        { status: 404 }
      );
    }

    return NextResponse.json(createApiResponse(resumeData));
  })
);

export const PUT = withErrorHandling(async (
  request: Request,
  context?: Record<string, unknown>
) => {
  const params = await (context as any)?.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json(
      createApiResponse({ error: 'Resume ID is required' }, false),
      { status: 400 }
    );
  }

  const data = await request.json();
  await updateResume(id, data);

  return NextResponse.json(
    createApiResponse({ message: 'Resume updated successfully' })
  );
});

export const DELETE = withErrorHandling(async (
  request: Request,
  context?: Record<string, unknown>
) => {
  const params = await (context as any)?.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json(
      createApiResponse({ error: 'Resume ID is required' }, false),
      { status: 400 }
    );
  }

  await deleteResume(id);
  
  return NextResponse.json(
    createApiResponse({ message: 'Resume deleted successfully' })
  );
});