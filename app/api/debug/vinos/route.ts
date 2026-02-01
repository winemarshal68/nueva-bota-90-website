import { NextResponse } from 'next/server';
import { parseVinosCSVWithDiagnostics } from '@/lib/csvParser';

export const runtime = 'nodejs';

export async function GET() {
  if (process.env.DEBUG_CSV !== '1') {
    return new Response(null, { status: 404 });
  }

  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  if (!csvUrl || csvUrl.trim() === '') {
    return NextResponse.json(
      {
        totalRows: 0,
        parsedRows: 0,
        availableRows: 0,
        disponibleTokenHistogram: {},
        headers: [],
        missingRequiredColumns: ['(csv url not configured)'],
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const response = await fetch(csvUrl, { cache: 'no-store' });

  if (!response.ok) {
    return NextResponse.json(
      {
        totalRows: 0,
        parsedRows: 0,
        availableRows: 0,
        disponibleTokenHistogram: {},
        headers: [],
        missingRequiredColumns: ['(csv fetch failed)'],
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const csvText = await response.text();
  const diagnostics = parseVinosCSVWithDiagnostics(csvText);

  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
