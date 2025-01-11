import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tagRecords = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(
      { tags: tagRecords },
      { status: 200, statusText: 'Tags Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tags):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
