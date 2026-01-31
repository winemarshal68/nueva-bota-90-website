import Link from 'next/link';
import { ExternalLink, Database, FileText, Clock } from 'lucide-react';
import { fetchCartaData, fetchVinosData } from '@/lib/menuDataFetcher';

// Admin page should always show fresh data
export const revalidate = 0;

export default async function AdminPage() {
  // Get Google Sheets URLs from environment variables
  const cartaEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA;
  const vinosEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS;
  const cartaCSVUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL;
  const vinosCSVUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  // Fetch current data for preview
  const cartaItems = await fetchCartaData();
  const vinosItems = await fetchVinosData();

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
              Carta - Primeros 10 items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-stone-200">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Sección</th>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Nombre</th>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Precio</th>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {cartaItems.slice(0, 10).map((item, idx) => (
                    <tr key={idx} className="border-b border-stone-100">
                      <td className="px-3 py-2 text-stone-600">{item.seccion}</td>
                      <td className="px-3 py-2 text-stone-900">{item.nombre}</td>
                      <td className="px-3 py-2 text-stone-600">
                        {item.precio || (item.precio_media && item.precio_entera ? `${item.precio_media}/${item.precio_entera}` : '—')}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${item.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.disponible ? 'SÍ' : 'NO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cartaItems.length > 10 && (
              <p className="text-xs text-stone-500 mt-2">
                ... y {cartaItems.length - 10} items más
              </p>
            )}
          </div>

          {/* Vinos Preview */}
          <div>
            <h3 className="text-lg font-semibold text-stone-900 mb-3">
              Vinos - Primeros 10 items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-stone-200">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Categoría</th>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Nombre</th>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Precio</th>
                    <th className="px-3 py-2 text-left border-b border-stone-200">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {vinosItems.slice(0, 10).map((item, idx) => (
                    <tr key={idx} className="border-b border-stone-100">
                      <td className="px-3 py-2 text-stone-600">{item.seccion}</td>
                      <td className="px-3 py-2 text-stone-900">{item.nombre}</td>
                      <td className="px-3 py-2 text-stone-600">{item.precio || '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${item.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.disponible ? 'SÍ' : 'NO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {vinosItems.length > 10 && (
              <p className="text-xs text-stone-500 mt-2">
                ... y {vinosItems.length - 10} items más
              </p>
            )}
          </div>
        </div>

        {/* Main content */}
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

        {/* Additional instructions */}
        <div className="bg-white shadow-lg rounded-lg p-8">
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
