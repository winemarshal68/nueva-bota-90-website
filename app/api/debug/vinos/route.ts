import { NextResponse } from 'next/server';
import { parseVinosCSVWithDiagnostics } from '@/lib/csvParser';
import { fetchVinosCSVText } from '@/lib/menuDataFetcher';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

function sha256Hex8(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}

export async function GET() {
  if (process.env.DEBUG_CSV !== '1') {
    return new Response(null, { status: 404 });
  }

  const fetched = await fetchVinosCSVText();
  const timestamp = new Date().toISOString();

  const rawCsvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;
  let csvUrlHost: string | null = null;
  let csvUrlPathHash: string | null = null;
  let csvUrlQueryHash: string | null = null;

  if (rawCsvUrl && rawCsvUrl.trim() !== '') {
    try {
      const u = new URL(rawCsvUrl);
      csvUrlHost = u.host;
      csvUrlPathHash = sha256Hex8(u.pathname);
      csvUrlQueryHash = sha256Hex8(u.search.startsWith('?') ? u.search.slice(1) : u.search);
    } catch {
      // Ignore invalid URL
    }
  }

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
        csvUrlHost,
        csvUrlPathHash,
        csvUrlQueryHash,
        contentLengthBytes: null,
        fetchOk: false,
        fetchStatus: fetched.status,
        fetchContentType: fetched.contentType,
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const diagnostics = parseVinosCSVWithDiagnostics(fetched.csvText);
  const contentLengthBytes = Buffer.byteLength(fetched.csvText, 'utf8');

  return NextResponse.json(
    {
      timestamp,
      ...diagnostics,
      csvUrlHost,
      csvUrlPathHash,
      csvUrlQueryHash,
      contentLengthBytes,
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
