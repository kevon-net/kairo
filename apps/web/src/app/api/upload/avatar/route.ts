import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { FILE_NAME } from '@/data/constants';
import { getSession } from '@/libraries/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Sign in to continue' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public/uploads/avatars');

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory may already exist, continue
      console.error('---> route handler error (create directory):', error);
    }

    const formData = await request.formData();
    const file = formData.get(FILE_NAME.avatar) as File;

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return success response with file details
    return NextResponse.json(
      {
        message: 'Avatar uploaded successfully',
        file: {
          name: fileName,
          size: file.size,
          path: `/uploads/avatars/${fileName}`,
        },
      },
      { status: 200, statusText: 'Avatar Uploaded' }
    );
  } catch (error) {
    console.error('---> route handler error (upload avatar):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add size limit to route configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
