import { LocalizationService } from '@amarty/services';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYearFormat',
  pure: false,
  standalone: true
})
export class MonthYearFormatPipe implements PipeTransform {
  constructor(private readonly localizationService: LocalizationService) {
  }

  transform(value: Date | string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    return new Intl.DateTimeFormat(this.localizationService.currentCulture, {
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}
