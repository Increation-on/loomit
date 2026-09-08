'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    console.log('🚀 [StatusBarSync] Компонент успешно смонтирован и начал слежку!');

    const updateStatus = () => {
      // 1. Проверяем состояние темной темы
      const hasDarkClassHtml = document.documentElement.classList.contains('dark');
      const hasDarkClassBody = document.body.classList.contains('dark');
      const dataThemeAttr = document.documentElement.getAttribute('data-theme');

      const isDark = hasDarkClassHtml || hasDarkClassBody || dataThemeAttr === 'dark';
      const targetColor = isDark ? '#121212' : '#FFFFFF';

      console.log('🔍 [StatusBarSync] Проверка темы:', { isDark, targetColor });

      // НАШ ТИПИЗИРОВАННЫЙ ФИКС: явно приводим тип к HTMLMetaElement
      const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;

      if (meta) {
        // Теперь TypeScript знает, что у meta есть атрибут content
        meta.setAttribute('content', targetColor);
        console.log(`🎨 [StatusBarSync] Обновлен существующий тег на цвет: ${targetColor}`);
      } else {
        // При создании нового элемента тоже явно задаем его тип
        const newMeta = document.createElement('meta');
        newMeta.name = 'theme-color';
        newMeta.content = targetColor;
        document.head.appendChild(newMeta);
        console.log(`🆕 [StatusBarSync] Создан новый мета-тег с цветом: ${targetColor}`);
      }
    };

    // Запускаем один раз при первой загрузке
    updateStatus();

    // Настраиваем MutationObserver для слежки за изменением темы кнопкой
    const observer = new MutationObserver(() => {
      console.log('⚡ [StatusBarSync] Сработал триггер клика темы!');
      updateStatus();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => {
      console.log('🛑 [StatusBarSync] Размонтирование компонента.');
      observer.disconnect();
    };
  }, []);

  return null;
}
