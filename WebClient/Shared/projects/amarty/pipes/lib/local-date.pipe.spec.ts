import { LocalDatePipe } from './local-date.pipe';
import { formatDate } from '@angular/common';

describe('LocalDatePipe', () => {
  let pipe: LocalDatePipe;

  beforeEach(() => {
    pipe = new LocalDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if no value is provided', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe(''); // Cast for testing null
    expect(pipe.transform(undefined as any)).toBe(''); // Cast for testing undefined
  });

  describe('Date object input', () => {
    // Using a specific UTC date to make tests more predictable across different system timezones.
    // The pipe itself uses the system's timezone for formatting due to Intl.DateTimeFormat().resolvedOptions().timeZone.
    const testDateUTC = new Date(Date.UTC(2023, 0, 15, 12, 30, 0)); // January 15, 2023, 12:30:00 UTC

    it('should format a Date object with default format "MMMM dd, yyyy"', () => {
      const expected = formatDate(testDateUTC, 'MMMM dd, yyyy', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
      expect(pipe.transform(testDateUTC)).toBe(expected);
    });

    it('should format a Date object with a custom format "shortDate"', () => {
      const expected = formatDate(testDateUTC, 'shortDate', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
      expect(pipe.transform(testDateUTC, 'shortDate')).toBe(expected);
    });
    
    it('should format a Date object with "dd.MM.yyyy HH:mm"', () => {
      const expected = formatDate(testDateUTC, 'dd.MM.yyyy HH:mm', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
      expect(pipe.transform(testDateUTC, 'dd.MM.yyyy HH:mm')).toBe(expected);
    });
  });

  describe('String input', () => {
    // ISO string (implicitly UTC)
    const dateStringISO = '2023-01-15T12:30:00.000Z'; 
    const testDateFromISO = new Date(dateStringISO);

    it('should format an ISO date string with default format', () => {
      const expected = formatDate(testDateFromISO, 'MMMM dd, yyyy', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
      expect(pipe.transform(dateStringISO)).toBe(expected);
    });

    it('should format a "yyyy-MM-dd" date string with custom format "MM/dd/yy"', () => {
      const dateStringSimple = '2023-03-25'; 
      // `new Date('yyyy-MM-dd')` parses as UTC midnight.
      const testDateForSimple = new Date(dateStringSimple);
      const expected = formatDate(testDateForSimple, 'MM/dd/yy', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
      expect(pipe.transform(dateStringSimple, 'MM/dd/yy')).toBe(expected);
    });
  });

  // The 'local' parameter is present in the pipe's signature but not used in its transform logic.
  // The formatDate call always uses the system's local timezone.
  it('should produce the same result regardless of the "local" parameter value due to current implementation', () => {
    const dateValue = new Date(Date.UTC(2023, 4, 10, 10, 0, 0)); // May 10, 2023 10:00 UTC
    const format = 'short';
    
    const expectedOutput = formatDate(dateValue, format, 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);

    expect(pipe.transform(dateValue, format, true)).toBe(expectedOutput);
    expect(pipe.transform(dateValue, format, false)).toBe(expectedOutput);
  });
});
