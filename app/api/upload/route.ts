import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

interface RecipientData {
  phoneNumber: string;
  name: string;
  price: number;
  itemType: string;
  status: string;
  batchId: string;
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    const isXLSX = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (!isCSV && !isXLSX) {
      return NextResponse.json(
        { error: 'File must be CSV or XLSX format' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const batchId = `BATCH-${uuidv4().substring(0, 8).toUpperCase()}-${Date.now()}`;

    let rows: any[] = [];

    if (isXLSX) {
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      const text = Buffer.from(buffer).toString('utf-8');
      const lines = text.split('\n').filter((line) => line.trim());
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map((v) => v.trim());
        
        const hasData = values.some((v) => v && v.length > 0);
        if (!hasData) continue;
        
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    console.log(`File parsed: ${rows.length} rows found`);
    if (rows.length > 0) {
      console.log('First row keys:', Object.keys(rows[0]));
      console.log('First row data:', rows[0]);
    }

    const recipients: RecipientData[] = [];
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const phoneNumber = row.number || row.phone_number || row.Number || row['Phone Number'] || '';
      const name = row.name || row.Name || '';
      const priceStr = row.price || row.Price || '';
      let itemType = row.item_type || row.itemType || row['Item Type'] || row.message || row.Message || row[''] || 'Certificate/s';

      if (i < 3) {
        console.log(`Row ${i + 1}:`, { phoneNumber, name, priceStr, itemType });
      }

      if (!phoneNumber || !name || !priceStr) {
        if (i < 5 || i >= rows.length - 5) {
          console.log(`Row ${i + 1} skipped: missing fields`, { phoneNumber, name, priceStr });
        }
        errorCount++;
        continue;
      }

      let formattedPhone = phoneNumber.toString().trim().replace(/\s+/g, '');
          
      if (formattedPhone.startsWith('+63')) {
        formattedPhone = '0' + formattedPhone.substring(3);
      } else if (formattedPhone.startsWith('63')) {
        formattedPhone = '0' + formattedPhone.substring(2);
      } else if (!formattedPhone.startsWith('0')) {
        errorCount++;
        continue;
      }

      if (!formattedPhone.startsWith('09') || formattedPhone.length !== 11) {
        if (i < 5) {
          console.log(`Row ${i + 1} skipped: invalid phone format ${formattedPhone} (length: ${formattedPhone.length})`);
        }
        errorCount++;
        continue;
      }

      const price = parseFloat(priceStr.toString());
      if (isNaN(price) || price <= 0) {
        console.log(`Row ${i + 1} skipped: invalid price`, priceStr);
        errorCount++;
        continue;
      }

      recipients.push({
        phoneNumber: formattedPhone,
        name: name.toString().trim(),
        price: price,
        itemType: itemType.toString().trim(),
        status: 'PENDING',
        batchId,
      });
    }

    console.log(`Processing complete: ${recipients.length} valid records, ${errorCount} errors`);

    if (recipients.length === 0) {
      return NextResponse.json(
        {
          error: `No valid records found. Processed ${rows.length} rows, ${errorCount} had errors.`,
        },
        { status: 400 }
      );
    }

    const created = await prisma.recipient.createMany({
      data: recipients,
    });

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        batchId,
        recordsProcessed: rows.length,
        recordsAdded: created.count,
        recordsSkipped: errorCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
