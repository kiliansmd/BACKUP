import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    const docRef = db.collection('resumes').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const data = doc.data();
    console.log("Fetched Firestore data:", data);

    return NextResponse.json({
      id: doc.id,
      ...data.parsed,
      fileName: data.fileName,
      uploadedAt: data.uploadedAt,
      meta: data.meta,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}