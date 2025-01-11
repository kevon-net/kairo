import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categoryRecords = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(
      { categories: categoryRecords },
      { status: 200, statusText: 'Categories Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get categories):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
