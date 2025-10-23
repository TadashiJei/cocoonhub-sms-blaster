import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing token' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const batches = await prisma.recipient.groupBy({
      by: ['batchId'],
      _count: {
        id: true,
      },
    });

    const batchDetails = await Promise.all(
      batches.map(async (batch) => {
        const [total, pending, sent, failed, firstRecord] = await Promise.all([
          prisma.recipient.count({ where: { batchId: batch.batchId } }),
          prisma.recipient.count({ where: { batchId: batch.batchId, status: 'PENDING' } }),
          prisma.recipient.count({ where: { batchId: batch.batchId, status: 'SENT' } }),
          prisma.recipient.count({ where: { batchId: batch.batchId, status: 'FAILED' } }),
          prisma.recipient.findFirst({
            where: { batchId: batch.batchId },
            orderBy: { createdAt: 'asc' },
          }),
        ]);

        return {
          batchId: batch.batchId,
          totalRecords: total,
          pending,
          sent,
          failed,
          createdAt: firstRecord?.createdAt,
        };
      })
    );

    return NextResponse.json(
      {
        batches: batchDetails.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Batches fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
