import { NextResponse } from 'next/server';
import { createResume } from '@/lib/firebase';
import { withErrorHandling, withRateLimit } from '@/lib/api-middleware';
import { fileUploadSchema, resumeSchema, createApiResponse } from '@/utils/validation';
import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseFormFromWebRequest(req: Request, maxFileSize: number = 20): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({
    maxFileSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
  });

  // Convert Request stream to Node.js Readable stream
  const readable = Readable.from(req.body as any);
  
  return new Promise((resolve, reject) => {
    form.parse(readable, (err: Error | null, fields: Fields, files: Files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export const POST = withRateLimit(10, 60000)(
  withErrorHandling(async (req: Request) => {
    let fields: Fields, files: Files;
    try {
      ({ fields, files } = await parseFormFromWebRequest(req, 20));
    } catch (err: any) {
      if (err?.message?.includes('maxFileSize exceeded')) {
        return NextResponse.json(
          createApiResponse({ error: 'Die Datei ist größer als 20 MB.' }, false),
          { status: 413 }
        );
      }
      return NextResponse.json(
        createApiResponse({ error: 'Fehler beim Datei-Upload: ' + err?.message }, false),
        { status: 400 }
      );
    }

    const fileArray = files.file;
    if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
      return NextResponse.json(
        createApiResponse({ error: 'Keine Datei hochgeladen.' }, false),
        { status: 400 }
      );
    }

    const file = fileArray[0];

    // Call external resume parser API
    if (!process.env.RESUME_PARSER_API_KEY) {
      throw new Error('RESUME_PARSER_API_KEY is not defined in environment variables');
    }

    const uploadFormData = new FormData();
    // @ts-ignore
    uploadFormData.append('file', file.filepath ? require('fs').createReadStream(file.filepath) : file);
    
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

    const parsedData = await response.json();

    // Validate the parsed data
    let validatedData;
    try {
      validatedData = await resumeSchema.parseAsync(parsedData);
    } catch (validationError) {
      console.warn('Parsed data validation warning:', validationError);
      validatedData = parsedData;
    }

    // Store in Firebase
    const resumeData = {
      ...validatedData,
      fileName: file.originalFilename,
      fileSize: file.size,
    };

    const resumeId = await createResume(resumeData);

    return NextResponse.json(
      createApiResponse({
        id: resumeId,
        message: 'Resume parsed and stored successfully',
        warnings: validatedData !== parsedData ? ['Some fields did not pass validation'] : []
      })
    );
  })
);