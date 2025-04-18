import { MatDateFormats } from '@angular/material/core';

export const DATE_FORMATS_DAY_MONTH_YEAR: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMATS_MONTH_YEAR: MatDateFormats = {
  parse: {
    dateInput: 'MM.YYYY',
  },
  display: {
    dateInput: 'MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
