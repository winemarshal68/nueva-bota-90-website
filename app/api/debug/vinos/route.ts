import { NextResponse } from 'next/server';
import { parseVinosCSVWithDiagnostics } from '@/lib/csvParser';
import { fetchVinosCSVText } from '@/lib/menuDataFetcher';

export const runtime = 'nodejs';

export async function GET() {
  if (process.env.DEBUG_CSV !== '1') {
    return new Response(null, { status: 404 });
  }

  const fetched = await fetchVinosCSVText();
  const timestamp = new Date().toISOString();

  if (!fetched.csvText) {
    return NextResponse.json(
      {
        timestamp,
        totalRows: 0,
        parsedRows: 0,
        availableRows: 0,
        disponibleTokenHistogram: {},
        headers: [],
        missingRequiredColumns: [],
        fetchOk: false,
        fetchStatus: fetched.status,
        fetchContentType: fetched.contentType,
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const diagnostics = parseVinosCSVWithDiagnostics(fetched.csvText);

  return NextResponse.json(
    {
      timestamp,
      ...diagnostics,
      fetchOk: true,
      fetchStatus: fetched.status,
      fetchContentType: fetched.contentType,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
