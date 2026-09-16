import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPath AI — Персональный маршрут поступления',
  description: 'AI-сервис навигации и пошагового плана поступления в вуз для абитуриентов',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
