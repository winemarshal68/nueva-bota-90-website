import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nueva Bota 90 - Cocina Mediterránea Contemporánea en La Herradura",
  description: "Restaurante de cocina mediterránea contemporánea en La Herradura, Andalucía. Ingredientes frescos, técnicas refinadas y pasión por el buen comer.",
  keywords: "restaurante, La Herradura, Andalucía, cocina mediterránea, comida, reservas",
  // Icons are auto-generated from app/icon.png and app/favicon.ico
  openGraph: {
    title: "Nueva Bota 90",
    description: "Cocina mediterránea contemporánea en el corazón de La Herradura",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
