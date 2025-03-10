import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
    name: 'localDate',
    standalone: true
})
export class LocalDatePipe implements PipeTransform {
    transform(value: string | Date, format: string = 'MMMM dd, yyyy', local: boolean = true): string {
        if (!value) return '';
        let date = new Date(value);
        return formatDate(date, format, 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
}
