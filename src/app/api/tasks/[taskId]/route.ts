import prisma from '@/libraries/prisma';
import { TaskCreate, TaskUpdate } from '@/types/models/task';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const taskRecord = await prisma.task.findUnique({
      where: { id: taskId },
      include: { tags: true, reminders: true, recurring_rule: true },
    });

    return NextResponse.json(
      { task: taskRecord },
      { status: 200, statusText: 'Task Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get task):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const task: TaskCreate = await request.json();

    const createTask = await prisma.task.create({ data: task });

    return NextResponse.json(
      { task: createTask },
      { status: 200, statusText: 'Task Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create task):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const task: TaskUpdate = await request.json();

    const updateTask = await prisma.task.update({
      where: { id: taskId },
      data: task,
    });

    return NextResponse.json(
      { task: updateTask },
      { status: 200, statusText: 'Task Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update task):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const deleteTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { task: deleteTask },
      { status: 200, statusText: 'Task Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete task):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
