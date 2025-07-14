import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import {
  RecurringRuleCreate,
  RecurringRuleUpdate,
} from '@/types/models/recurring-rule';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recurringRuleId: string }> }
) {
  try {
    const { recurringRuleId } = await params;

    const recurringRuleRecord = await prisma.recurringRule.findUnique({
      where: { id: recurringRuleId },
    });

    return NextResponse.json(
      { recurringRule: recurringRuleRecord },
      { status: 200, statusText: 'Recurring Rule Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get recurring rule):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const recurringRule: RecurringRuleCreate = await request.json();

    const createRecurringRule = await prisma.recurringRule.create({
      data: recurringRule,
    });

    return NextResponse.json(
      { recurringRule: createRecurringRule },
      { status: 200, statusText: 'Recurring Rule Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create recurring rule):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recurringRuleId: string }> }
) {
  try {
    const { recurringRuleId } = await params;

    const recurringRule: RecurringRuleUpdate = await request.json();

    const updateRecurringRule = await prisma.recurringRule.update({
      where: { id: recurringRuleId },
      data: recurringRule,
    });

    return NextResponse.json(
      { recurringRule: updateRecurringRule },
      { status: 200, statusText: 'Recurring Rule Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update recurring rule):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ recurringRuleId: string }> }
) {
  try {
    const { recurringRuleId } = await params;

    const deleteRecurringRule = await prisma.recurringRule.delete({
      where: { id: recurringRuleId },
    });

    return NextResponse.json(
      { recurringRule: deleteRecurringRule },
      { status: 200, statusText: 'Recurring Rule Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete recurring rule):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
