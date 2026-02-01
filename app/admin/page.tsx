import Link from 'next/link';
import { ExternalLink, Database, FileText, Clock, Activity } from 'lucide-react';
import { fetchCartaData, fetchCartaCSVText, fetchVinosCSVText, fetchVinosData } from '@/lib/menuDataFetcher';
import { parseCartaCSVWithDiagnostics, parseVinosCSVWithDiagnostics } from '@/lib/csvParser';

// Admin page should always show fresh data
export const revalidate = 0;

/**
 * Health check result for a CSV URL
 */
type HealthCheckResult = {
  url: string;
  maskedUrl: string;
  status: number | null;
  statusText: string;
  timestamp: string;
  error?: string;
  // Enhanced diagnostics (only when fetchBody=true)
  contentType?: string;
  bodyPreview?: string;
  parsedHeaders?: string[];
};

/**
 * Performs a HEAD request to check if a CSV URL is accessible
 * Returns status code and other diagnostic info
 * @param fetchBody - If true, performs GET and returns body preview + headers
 */
async function checkCSVHealth(url: string | undefined, fetchBody = false): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();

  if (!url || url.trim() === '') {
    return {
      url: '',
      maskedUrl: 'Not configured',
      status: null,
      statusText: 'URL not set',
      timestamp,
      error: 'CSV URL environment variable is not configured',
    };
  }

  // Mask the URL for security (show domain + last 20 chars)
  const maskedUrl = maskUrl(url);

  try {
    // Perform HEAD or GET request based on fetchBody flag
    const response = await fetch(url, {
      method: fetchBody ? 'GET' : 'HEAD',
      cache: 'no-store', // Don't use cache for health checks
    });

    const result: HealthCheckResult = {
      url,
      maskedUrl,
      status: response.status,
      statusText: response.statusText,
      timestamp,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
    };

    // Enhanced diagnostics when fetching body
    if (fetchBody && response.ok) {
      const contentType = response.headers.get('Content-Type') || 'unknown';
      result.contentType = contentType;

      try {
        const bodyText = await response.text();
        // First 200 characters for preview (safe from secrets/full docs)
        result.bodyPreview = bodyText.slice(0, 200);

        // Parse first line (CSV headers) by splitting on comma
        const firstLine = bodyText.split('\n')[0];
        result.parsedHeaders = firstLine ? firstLine.split(',').map(h => h.trim()) : [];
      } catch (bodyError) {
        result.error = `Failed to read response body: ${bodyError instanceof Error ? bodyError.message : String(bodyError)}`;
      }
    }

    return result;
  } catch (error) {
    return {
      url,
      maskedUrl,
      status: null,
      statusText: 'Request failed',
      timestamp,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Masks a URL for display, showing domain and last 20 characters
 */
function maskUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;
    if (path.length <= 30) {
      return `${urlObj.hostname}${path}`;
    }
    const suffix = path.slice(-30);
    return `${urlObj.hostname}/...${suffix}`;
  } catch {
    // If URL parsing fails, just show last 40 chars
    if (url.length <= 50) return url;
    return `...${url.slice(-50)}`;
  }
}

export default async function AdminPage() {
  // Get Google Sheets URLs from environment variables
  const cartaEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA;
  const vinosEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS;
  const cartaCSVUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL;
  const vinosCSVUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  // Perform CSV health checks
  // Carta: fetch body for enhanced diagnostics (Content-Type, headers, preview)
  const cartaHealth = await checkCSVHealth(cartaCSVUrl, true);
  // Vinos: HEAD only for basic connectivity check
  const vinosHealth = await checkCSVHealth(vinosCSVUrl);

  // Fetch current data for preview
  const cartaResult = await fetchCartaData();
  const vinosResult = await fetchVinosData();

  const debugEnabled = process.env.DEBUG_CSV === '1';
  const MIN_VINOS_ROWS = 5;
  const MIN_CARTA_ITEMS = 10;
  const MIN_CARTA_CATEGORIES = 2;

  // Extract data arrays (handle new FetchResult type)
  const cartaItems = cartaResult.data;
  const vinosItems = vinosResult.data;

  let resolvedVinosDiagnostics: ReturnType<typeof parseVinosCSVWithDiagnostics> | null = null;
  let resolvedCartaDiagnostics: ReturnType<typeof parseCartaCSVWithDiagnostics> | null = null;
  if (debugEnabled) {
    const fetchedVinos = await fetchVinosCSVText();
    if (fetchedVinos.csvText) {
      resolvedVinosDiagnostics = parseVinosCSVWithDiagnostics(fetchedVinos.csvText);
    }
    const fetchedCarta = await fetchCartaCSVText();
    if (fetchedCarta.csvText) {
      resolvedCartaDiagnostics = parseCartaCSVWithDiagnostics(fetchedCarta.csvText);
    }
  }

  // Current server time for "last fetched" display
  const serverTime = new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  // Determine data sources
  const cartaSource = cartaCSVUrl && cartaCSVUrl.trim() !== ''
    ? 'Google Sheets (CSV)'
    : 'JSON local (fallback)';
  const vinosSource = vinosCSVUrl && vinosCSVUrl.trim() !== ''
    ? 'Google Sheets (CSV)'
    : 'JSON local (fallback)';

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-lg text-stone-600">
            Gestiona el contenido de la carta y la lista de vinos
          </p>
        </div>

        {/* Primary Action: Edit Google Sheets */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6">
            Editar Hojas de Google
          </h2>

          <p className="text-stone-600 mb-8">
            Haz clic en los botones de abajo para abrir las hojas de Google donde puedes editar el contenido del menú.
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Carta button */}
            {cartaEditUrl ? (
              <a
                href={cartaEditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">Abrir hoja de la carta</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                ⚠️ URL de la carta no configurada
              </div>
            )}

            {/* Vinos button */}
            {vinosEditUrl ? (
              <a
                href={vinosEditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">Abrir hoja de vinos</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                ⚠️ URL de vinos no configurada
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="mt-8 bg-green-50 border border-green-300 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>✓ Actualización rápida:</strong> Los cambios que hagas en las hojas se reflejarán en la web en aproximadamente 1-2 minutos.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">
            Instrucciones
          </h3>

          {/* Important notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-amber-900 mb-3">⚠️ Importante</h4>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>La hoja ya viene pre-rellenada</strong> con los datos actuales del menú</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>No borres las cabeceras</strong> (primera fila con nombres de columnas)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Para ocultar un item</strong>, pon disponible=FALSE (no borres la fila completa)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Los cambios aparecen en 1-2 minutos</strong> en la web (caché de 60 segundos)</span>
              </li>
            </ul>
          </div>

          <ul className="space-y-3 text-stone-600">
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">1.</span>
              <span>Haz clic en el botón correspondiente para abrir la hoja de Google.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">2.</span>
              <span>Edita el contenido directamente en la hoja (nombre, descripción, precio, etc.).</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">3.</span>
              <span>Para ocultar temporalmente un plato o vino, cambia la columna &quot;disponible&quot; a FALSE.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">4.</span>
              <span>Los cambios se guardan automáticamente en Google Sheets.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">5.</span>
              <span>Espera 1-2 minutos para ver los cambios reflejados en la web (actualización rápida).</span>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              Si necesitas añadir nuevos items, simplemente añade una nueva fila al final de la hoja y rellena todas las columnas.
            </p>
          </div>
        </div>

        {/* Cache Status */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Estado de Caché
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span className="font-semibold text-blue-900">Última actualización</span>
            </div>
            <p className="text-sm text-blue-800">
              Datos obtenidos del servidor a las: <strong>{serverTime}</strong>
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Política de caché: <strong>60 segundos</strong> (los cambios en Google Sheets aparecen en 1-2 minutos)
            </p>
          </div>
        </div>

        {/* CSV Health Check */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            CSV Health Check
          </h2>

          <p className="text-sm text-stone-600 mb-6">
            Diagnostica si las URLs de Google Sheets CSV son accesibles desde el servidor de Vercel.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Carta Health Check */}
            <div className={`border-2 rounded-lg p-4 ${
              cartaHealth.status === 200
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}>
              <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                Carta CSV
                {cartaHealth.status === 200 ? (
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">✓ OK</span>
                ) : (
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">✗ ERROR</span>
                )}
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-stone-600 font-medium">URL:</span>
                  <p className="text-xs text-stone-700 break-all mt-1 font-mono bg-white/50 p-2 rounded">
                    {cartaHealth.maskedUrl}
                  </p>
                </div>

                <div>
                  <span className="text-stone-600 font-medium">HTTP Status:</span>
                  <p className={`text-sm font-semibold mt-1 ${
                    cartaHealth.status === 200 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {cartaHealth.status !== null ? `${cartaHealth.status} ${cartaHealth.statusText}` : 'No response'}
                  </p>
                </div>

                {cartaHealth.error && (
                  <div>
                    <span className="text-stone-600 font-medium">Error:</span>
                    <p className="text-xs text-red-700 mt-1 break-words">
                      {cartaHealth.error}
                    </p>
                  </div>
                )}

                {cartaResult.error && (
                  <div>
                    <span className="text-stone-600 font-medium">Fetch Error:</span>
                    <p className="text-xs text-red-700 mt-1 break-words">
                      {cartaResult.error}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-stone-600 font-medium">Timestamp:</span>
                  <p className="text-xs text-stone-700 mt-1">
                    {new Date(cartaHealth.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>

                {/* Enhanced diagnostics */}
                {cartaHealth.contentType && (
                  <div>
                    <span className="text-stone-600 font-medium">Content-Type:</span>
                    <p className="text-xs text-stone-700 mt-1 font-mono bg-white/50 p-2 rounded">
                      {cartaHealth.contentType}
                    </p>
                  </div>
                )}

                {cartaHealth.parsedHeaders && cartaHealth.parsedHeaders.length > 0 && (
                  <div>
                    <span className="text-stone-600 font-medium">CSV Headers (parsed):</span>
                    <p className="text-xs text-stone-700 mt-1 font-mono bg-white/50 p-2 rounded">
                      [{cartaHealth.parsedHeaders.join(', ')}]
                    </p>
                  </div>
                )}

                {cartaHealth.bodyPreview && (
                  <div>
                    <span className="text-stone-600 font-medium">Body Preview (first 200 chars):</span>
                    <p className="text-xs text-stone-700 mt-1 font-mono bg-white/50 p-2 rounded whitespace-pre-wrap break-all">
                      {cartaHealth.bodyPreview}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Vinos Health Check */}
            <div className={`border-2 rounded-lg p-4 ${
              vinosHealth.status === 200
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}>
              <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                Vinos CSV
                {vinosHealth.status === 200 ? (
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">✓ OK</span>
                ) : (
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">✗ ERROR</span>
                )}
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-stone-600 font-medium">URL:</span>
                  <p className="text-xs text-stone-700 break-all mt-1 font-mono bg-white/50 p-2 rounded">
                    {vinosHealth.maskedUrl}
                  </p>
                </div>

                <div>
                  <span className="text-stone-600 font-medium">HTTP Status:</span>
                  <p className={`text-sm font-semibold mt-1 ${
                    vinosHealth.status === 200 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {vinosHealth.status !== null ? `${vinosHealth.status} ${vinosHealth.statusText}` : 'No response'}
                  </p>
                </div>

                {vinosHealth.error && (
                  <div>
                    <span className="text-stone-600 font-medium">Error:</span>
                    <p className="text-xs text-red-700 mt-1 break-words">
                      {vinosHealth.error}
                    </p>
                  </div>
                )}

                {vinosResult.error && (
                  <div>
                    <span className="text-stone-600 font-medium">Fetch Error:</span>
                    <p className="text-xs text-red-700 mt-1 break-words">
                      {vinosResult.error}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-stone-600 font-medium">Timestamp:</span>
                  <p className="text-xs text-stone-700 mt-1">
                    {new Date(vinosHealth.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help text for common issues */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">💡 Troubleshooting</h4>
            <ul className="text-xs text-amber-800 space-y-1">
              <li><strong>401 Unauthorized:</strong> Google Sheet is not published publicly. Go to File → Share → Publish to web</li>
              <li><strong>403 Forbidden:</strong> Sheet sharing permissions may be restricted</li>
              <li><strong>404 Not Found:</strong> CSV URL may be incorrect or sheet was deleted</li>
              <li><strong>No response:</strong> Network error or invalid URL format</li>
            </ul>
          </div>
        </div>

        {/* Data Source Status */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <Database className="w-6 h-6" />
            Estado / Fuente de Datos
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Carta source */}
            <div className="border border-stone-200 rounded-lg p-4">
              <h3 className="font-semibold text-stone-900 mb-2">Carta</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-600">Fuente:</span>
                <span className={`font-semibold ${cartaSource.includes('CSV') ? 'text-green-700' : 'text-amber-700'}`}>
                  {cartaSource}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-stone-600">CSV URL:</span>
                <span className={`text-xs ${cartaCSVUrl ? 'text-green-700' : 'text-red-600'}`}>
                  {cartaCSVUrl ? '✓ configurado' : '✗ no configurado'}
                </span>
              </div>
              <div className="text-sm text-stone-500 mt-2">
                {cartaItems.length} items en total
              </div>

              {debugEnabled && resolvedCartaDiagnostics && (resolvedCartaDiagnostics.parsedItemsCount < MIN_CARTA_ITEMS || resolvedCartaDiagnostics.categoryCount < MIN_CARTA_CATEGORIES) && (
                <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded p-3">
                  ⚠ Carta feed unusually small ({resolvedCartaDiagnostics.parsedItemsCount} items, {resolvedCartaDiagnostics.categoryCount} categories). Check source sheet.
                  {resolvedCartaDiagnostics.missingRequiredColumns.length > 0 && (
                    <div className="mt-1 text-xs text-amber-800">
                      Missing columns: {resolvedCartaDiagnostics.missingRequiredColumns.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vinos source */}
            <div className="border border-stone-200 rounded-lg p-4">
              <h3 className="font-semibold text-stone-900 mb-2">Vinos</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-600">Fuente:</span>
                <span className={`font-semibold ${vinosSource.includes('CSV') ? 'text-green-700' : 'text-amber-700'}`}>
                  {vinosSource}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-stone-600">CSV URL:</span>
                <span className={`text-xs ${vinosCSVUrl ? 'text-green-700' : 'text-red-600'}`}>
                  {vinosCSVUrl ? '✓ configurado' : '✗ no configurado'}
                </span>
              </div>
              <div className="text-sm text-stone-500 mt-2">
                {vinosItems.length} items en total
              </div>

              {debugEnabled && resolvedVinosDiagnostics && resolvedVinosDiagnostics.parsedRows < MIN_VINOS_ROWS && (
                <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded p-3">
                  ⚠ Vinos feed unusually small ({resolvedVinosDiagnostics.parsedRows} rows). Check source sheet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Vista previa (lo que hay en la web ahora)
          </h2>

          <p className="text-stone-600 mb-6">
            Esta es una muestra de los datos que se están mostrando actualmente en la web.
          </p>

          {/* Carta Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-stone-900 mb-3">
              Carta - Todos los items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-stone-200">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Sección</th>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Precio</th>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {cartaItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 text-stone-600 border-l-2 border-stone-300 bg-stone-50/50">{item.seccion}</td>
                      <td className="px-4 py-3 text-stone-900">{item.nombre}</td>
                      <td className="px-4 py-3 text-stone-600 font-mono">
                        {item.precio || (item.precio_media && item.precio_entera ? (
                          <span className="whitespace-nowrap">
                            <span className="text-stone-700">{item.precio_media}</span>
                            <span className="text-stone-400 mx-1">/</span>
                            <span className="text-stone-700">{item.precio_entera}</span>
                          </span>
                        ) : '—')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${item.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.disponible ? 'SÍ' : 'NO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vinos Preview */}
          <div>
            <h3 className="text-lg font-semibold text-stone-900 mb-3">
              Vinos - Todos los items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-stone-200">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Categoría</th>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Precio</th>
                    <th className="px-4 py-3 text-left border-b border-stone-200 font-semibold">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {vinosItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 text-stone-600 border-l-2 border-stone-300 bg-stone-50/50">{item.seccion}</td>
                      <td className="px-4 py-3 text-stone-900">{item.nombre}</td>
                      <td className="px-4 py-3 text-stone-600 font-mono">{item.precio || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${item.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.disponible ? 'SÍ' : 'NO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 underline"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Panel de Administración - Nueva Bota 90',
  robots: 'noindex, nofollow', // Don't index admin pages
};
