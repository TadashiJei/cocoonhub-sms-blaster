import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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
        { error: 'Forbidden: Only admins and operators can reset data' },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    if (action === 'reset-recipients') {
      console.log('Resetting all recipients...');
      const deleted = await prisma.recipient.deleteMany({});
      console.log(`Deleted ${deleted.count} recipients`);
      return NextResponse.json(
        {
          message: `All ${deleted.count} recipients deleted successfully`,
          count: deleted.count,
        },
        { status: 200 }
      );
    }

    if (action === 'reset-all') {
      const deletedRecipients = await prisma.recipient.deleteMany({});
      const deletedUsers = await prisma.user.deleteMany({});

      return NextResponse.json(
        {
          message: 'All data reset successfully',
          recipients: deletedRecipients.count,
          users: deletedUsers.count,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Reset error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: `Failed to reset data: ${errorMessage}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
