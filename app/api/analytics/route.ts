import { NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/services/googleSheets';

export async function GET() {
  try {
    const data = await GoogleSheetsService.fetchData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}