// src/components/layout/Footer.tsx
'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Скрываем футер на странице админки
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} LoomIt. Все права защищены.</p>
          <p className="text-xs mt-1">Создавайте и проходите квизы даже без интернета</p>
        </div>
      </div>
    </footer>
  );
}