import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categoryRecords = await prisma.category.findMany();

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
