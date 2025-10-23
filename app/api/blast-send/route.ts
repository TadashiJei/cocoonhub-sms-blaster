import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { getTemplateById, generateMessage as generateMessageFromTemplate } from '@/lib/message-templates';

const prisma = new PrismaClient();
const SEMAPHORE_API_KEY = process.env.SEMAPHORE_API_KEY;
const BATCH_SIZE = 50;

interface SemaphoreResponse {
  message_id?: string;
  status?: string;
  recipient?: string;
  error?: string;
}

async function sendSemaphoreMessage(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; response: SemaphoreResponse }> {
  try {
    const response = await fetch('https://api.semaphore.co/api/v4/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: SEMAPHORE_API_KEY || '',
        number: phoneNumber,
        message: message,
        sendername: 'CocoonHub',
      }).toString(),
    });

    const data = await response.json();
    
    console.log(`Semaphore response status: ${response.status}`, data);

    if (response.ok && Array.isArray(data) && data.length > 0 && data[0].message_id) {
      return { success: true, response: data[0] as SemaphoreResponse };
    }

    if (response.ok && !Array.isArray(data) && data.message_id) {
      return { success: true, response: data as SemaphoreResponse };
    }

    console.log(`Semaphore API error:`, data);
    return { success: false, response: Array.isArray(data) ? data[0] : data };

  } catch (error) {
    return {
      success: false,
      response: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
}

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
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { batchId, templateId = 'default' } = body;

    if (!batchId) {
      return NextResponse.json(
        { error: 'Missing required field: batchId' },
        { status: 400 }
      );
    }

    console.log(`Looking for pending recipients in batch: ${batchId}`);
    const pendingRecipients = await prisma.recipient.findMany({
      where: {
        batchId,
        status: 'PENDING',
      },
      take: BATCH_SIZE,
    });

    console.log(`Found ${pendingRecipients.length} pending recipients`);
    if (pendingRecipients.length === 0) {
      console.log(`No pending recipients found for batch ${batchId}`);
      const allRecipients = await prisma.recipient.findMany({
        where: { batchId },
      });
      console.log(`Total recipients in batch: ${allRecipients.length}`);
      if (allRecipients.length > 0) {
        console.log(`First recipient status: ${allRecipients[0].status}`);
      }
      return NextResponse.json(
        { message: 'No pending recipients to send', sentCount: 0, failedCount: 0 },
        { status: 200 }
      );
    }

    let sentCount = 0;
    let failedCount = 0;

    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    console.log(`Starting to send ${pendingRecipients.length} messages`);
    console.log(`SEMAPHORE_API_KEY exists: ${!!SEMAPHORE_API_KEY}`);
    
    for (const recipient of pendingRecipients) {
      const message = generateMessageFromTemplate(template, {
        name: recipient.name,
        itemType: recipient.itemType,
        price: recipient.price.toNumber(),
      });

      const semaphorePhoneNumber = recipient.phoneNumber.startsWith('09')
        ? '+63' + recipient.phoneNumber.substring(1)
        : recipient.phoneNumber;

      console.log(`Sending to ${semaphorePhoneNumber}`);
      const { success, response } = await sendSemaphoreMessage(
        semaphorePhoneNumber,
        message
      );
      console.log(`Result: ${success ? 'SUCCESS' : 'FAILED'}`, response);

      if (success) {
        console.log(`✅ Message sent to ${semaphorePhoneNumber}`);
        await prisma.recipient.update({
          where: { id: recipient.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
            apiResponse: JSON.stringify(response),
          },
        });
        sentCount++;
      } else {
        console.log(`❌ Message failed for ${semaphorePhoneNumber}:`, response);
        await prisma.recipient.update({
          where: { id: recipient.id },
          data: {
            status: 'FAILED',
            apiResponse: JSON.stringify(response),
          },
        });
        failedCount++;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return NextResponse.json(
      {
        message: 'Blast completed',
        sentCount,
        failedCount,
        totalProcessed: sentCount + failedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blast send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
