// Нормализация названия категории: нижний регистр + удаление всех пробелов
export function normalizeCategoryName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}