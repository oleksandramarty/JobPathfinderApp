import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {traceCreation} from '@amarty/utils';

@Pipe({
    name: 'sanitizeHtml',
    standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
      traceCreation(this);
    }

    transform(value: string | undefined): SafeHtml {
        return value ? this.sanitizer.bypassSecurityTrustHtml(value) : '';
    }
}
