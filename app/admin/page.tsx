import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function AdminPage() {
  // Get Google Sheets edit URLs from environment variables
  const cartaEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA;
  const vinosEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS;

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
          <div className="mt-8 bg-stone-100 border border-stone-300 rounded-lg p-4">
            <p className="text-stone-700 text-sm">
              <strong>Nota:</strong> Los cambios que hagas en las hojas pueden tardar hasta 1 hora en reflejarse en la web debido al sistema de caché.
            </p>
          </div>
        </div>

        {/* Additional instructions */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">
            Instrucciones
          </h3>
          <ul className="space-y-3 text-stone-600">
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">1.</span>
              <span>Haz clic en el botón correspondiente para abrir la hoja de Google.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">2.</span>
              <span>Edita el contenido directamente en la hoja (nombre, descripción, precio, disponibilidad, etc.).</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">3.</span>
              <span>Los cambios se guardan automáticamente en Google Sheets.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">4.</span>
              <span>Espera hasta 1 hora para ver los cambios reflejados en la web.</span>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              Para más información sobre cómo editar las hojas, consulta la documentación completa.
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
