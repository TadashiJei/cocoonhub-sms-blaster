import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
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

    if (decoded.role !== 'ADMIN' && decoded.role !== 'OPERATOR') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get('id');
    const batchId = searchParams.get('batchId');

    if (recipientId) {
      const deleted = await prisma.recipient.delete({
        where: { id: parseInt(recipientId) },
      });

      return NextResponse.json(
        { message: 'Recipient deleted successfully', deleted },
        { status: 200 }
      );
    }

    if (batchId) {
      const deleted = await prisma.recipient.deleteMany({
        where: { batchId },
      });

      return NextResponse.json(
        { message: `${deleted.count} recipients deleted successfully`, count: deleted.count },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Missing recipient ID or batch ID' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: `Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
