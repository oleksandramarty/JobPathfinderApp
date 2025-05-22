import { Platform } from '@angular/cdk/platform';
import { MonthYearDateAdapter } from './month-year-date-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';

describe('MonthYearDateAdapter', () => {
  let adapter: MonthYearDateAdapter;
  let platform: Platform;

  beforeEach(() => {
    platform = new Platform(); 
    adapter = new MonthYearDateAdapter('en-US', platform); 
  });

  it('should create an instance', () => {
    expect(adapter).toBeTruthy();
  });

  describe('parse', () => {
    it('should parse "MM.YYYY" string correctly', () => {
      const date = adapter.parse('03.2023');
      expect(date).toEqual(new Date(2023, 2, 1)); 
    });

    it('should parse "M.YYYY" string correctly (single digit month)', () => {
      const date = adapter.parse('3.2023');
      expect(date).toEqual(new Date(2023, 2, 1));
    });

    it('should return null for invalid "MM.YYYY" month part (e.g., 13.2023, 00.2023)', () => {
      expect(adapter.parse('13.2023')).toBeNull();
      // The adapter's logic `Number(parts[0]) - 1` means "00" becomes -1, which is invalid for Date month.
      // However, if the intention is to parse "00" as an error upfront:
      // For `Number("00")-1` it's -1. `new Date(2023, -1, 1)` is `new Date(2022, 11, 1)` (Dec 1st 2022).
      // The code does not explicitly check for month being 0 before creating the Date.
      // Depending on desired strictness, this might be a valid date (Dec of previous year) or null.
      // Given current logic, it would produce a date. If "00" month is invalid, the adapter needs a check.
      // For now, testing based on current code.
      // If we want "00" to be invalid, the test should be `expect(adapter.parse('00.2023')).toBeNull();`
      // but the current code might produce a date like `new Date(2023, -1, 1)`.
      // Let's assume "00" should be invalid for a month input string.
      // The current code `Number(parts[0]) - 1` makes "00" -> -1. `new Date(year, -1, 1)` is valid (Nov of prev year).
      // To make "00" invalid, the adapter needs `if (month < 0 || month > 11)` check after `Number(parts[0]) - 1`.
      // Or check `Number(parts[0])` is between 1 and 12.
      // Sticking to "invalid month" for the intent of the test.
      expect(adapter.parse('00.2023')).toBeNull(); // Corrected expectation: month 0 is invalid for MM.YYYY
    });
    
    it('should return null for "MM.YYYY" with invalid year part', () => {
        expect(adapter.parse('03.YYY')).toBeNull();
    });

    it('should fall back to super.parse for standard ISO date strings', () => {
      const isoDateStr = '2023-03-15T00:00:00.000Z';
      const date = adapter.parse(isoDateStr);
      expect(date?.getUTCFullYear()).toBe(2023);
      expect(date?.getUTCMonth()).toBe(2); 
      expect(date?.getUTCDate()).toBe(15);
    });
    
    it('should fall back to super.parse for Date objects', () => {
      const originalDate = new Date(2023, 2, 15);
      const date = adapter.parse(originalDate);
      expect(date).toEqual(originalDate);
    });

    it('should return null for invalid strings not matching "MM.YYYY" or standard formats recognizable by NativeDateAdapter', () => {
      expect(adapter.parse('invalid-date-string')).toBeNull();
      // NativeDateAdapter with 'en-US' locale might parse '03/15/2023' but not '03/2023' for a full date.
      // Since our custom parse handles 'MM.YYYY', other partials fall to NativeDateAdapter which expects full dates.
      expect(adapter.parse('03/2023')).toBeNull(); 
    });
    
    it('should return null if value is empty string', () => {
        expect(adapter.parse('')).toBeNull();
    });

    it('should return null if value is not a string or Date', () => {
      expect(adapter.parse(123)).toBeNull();
      expect(adapter.parse(null)).toBeNull();
      expect(adapter.parse(undefined)).toBeNull();
      expect(adapter.parse({})).toBeNull();
    });
  });

  describe('format', () => {
    it('should format date as "MM.YYYY" when displayFormat is "MM.YYYY"', () => {
      const date = new Date(2023, 2, 15); 
      expect(adapter.format(date, 'MM.YYYY')).toBe('03.2023');
    });
    
    it('should format single digit month with leading zero for "MM.YYYY"', () => {
      const date = new Date(2023, 0, 5); 
      expect(adapter.format(date, 'MM.YYYY')).toBe('01.2023');
    });

    it('should format date as "DD.MM.YYYY" for other displayFormats (e.g., object)', () => {
      const date = new Date(2023, 2, 5); 
      expect(adapter.format(date, { someOtherFormat: true })).toBe('05.03.2023');
    });
    
    it('should format date as "DD.MM.YYYY" for other displayFormats (e.g., different string)', () => {
      const date = new Date(2023, 2, 5); 
      expect(adapter.format(date, 'DD/MM/YYYY')).toBe('05.03.2023'); // Default fallback format
    });
    
    it('should format single digit day and month with leading zeros for "DD.MM.YYYY"', () => {
      const date = new Date(2023, 0, 5); 
      expect(adapter.format(date, {})).toBe('05.01.2023');
    });
  });
});
