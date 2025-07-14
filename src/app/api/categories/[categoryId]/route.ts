import prisma from '@/libraries/prisma';
import { CategoryCreate, CategoryUpdate } from '@/types/models/category';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const categoryRecord = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { category: categoryRecord },
      { status: 200, statusText: 'Category Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get category):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const category: CategoryCreate = await request.json();

    const createCategory = await prisma.category.create({ data: category });

    return NextResponse.json(
      { category: createCategory },
      { status: 200, statusText: 'Category Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create category):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const category: CategoryUpdate = await request.json();

    const updateCategory = await prisma.category.update({
      where: { id: categoryId },
      data: category,
    });

    return NextResponse.json(
      { category: updateCategory },
      { status: 200, statusText: 'Category Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update category):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const deleteCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { category: deleteCategory },
      { status: 200, statusText: 'Category Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete category):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
