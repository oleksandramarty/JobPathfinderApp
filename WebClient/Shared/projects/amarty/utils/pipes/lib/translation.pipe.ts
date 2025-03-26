import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '@amarty/services';
import {traceCreation} from '@amarty/utils';

@Pipe({
    name: 'translation',
    pure: false,
    standalone: true
})
export class TranslationPipe implements PipeTransform {
    constructor(private localizationService: LocalizationService) {
      traceCreation(this);
    }

    transform(key: string | undefined): string {
        if (!key) {
            return '';
        }

        const translation = this.localizationService.getTranslation(key);
        return translation || key;
    }
}
