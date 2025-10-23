import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

    const searchParams = request.nextUrl.searchParams;
    const batchId = searchParams.get('batchId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (batchId) where.batchId = batchId;
    if (status) where.status = status;

    const [recipients, total] = await Promise.all([
      prisma.recipient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.recipient.count({ where }),
    ]);

    return NextResponse.json(
      {
        recipients: recipients.map((r) => ({
          id: r.id,
          phoneNumber: r.phoneNumber,
          name: r.name,
          price: r.price.toNumber(),
          itemType: r.itemType,
          status: r.status,
          sentAt: r.sentAt,
          batchId: r.batchId,
          apiResponse: r.apiResponse,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Recipients fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
