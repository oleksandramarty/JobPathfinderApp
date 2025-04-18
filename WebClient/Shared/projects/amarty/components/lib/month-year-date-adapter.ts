import { NativeDateAdapter } from '@angular/material/core';

export class MonthYearDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.length) {
      // Если формат MM.YYYY
      const parts = value.split('.');
      if (parts.length === 2) {
        const month = Number(parts[0]) - 1; // месяцы начинаются с 0
        const year = Number(parts[1]);
        if (!isNaN(month) && !isNaN(year)) {
          return new Date(year, month, 1); // первое число месяца
        }
      }
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'MM.YYYY') {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}.${year}`;
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
