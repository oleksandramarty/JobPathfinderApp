import { MonthYearFormatPipe } from './month-year-format.pipe';
import { LocalizationService } from '@amarty/services';

// Mock LocalizationService
class MockLocalizationService {
  public currentCulture: string = 'en-US'; // Default mock culture
}

describe('MonthYearFormatPipe', () => {
  let pipe: MonthYearFormatPipe;
  let mockLocalizationService: MockLocalizationService;

  beforeEach(() => {
    mockLocalizationService = new MockLocalizationService();
    pipe = new MonthYearFormatPipe(mockLocalizationService as any);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if no value is provided', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  describe('Date object input', () => {
    const testDate = new Date(2023, 0, 15); // January 15, 2023 (Month is 0-indexed)

    it('should format a Date object to month and year for "en-US" culture', () => {
      mockLocalizationService.currentCulture = 'en-US';
      expect(pipe.transform(testDate)).toBe('January 2023');
    });

    it('should format a Date object to month and year for "de-DE" culture', () => {
      mockLocalizationService.currentCulture = 'de-DE';
      expect(pipe.transform(testDate)).toBe('Januar 2023');
    });
    
    it('should format a different Date object correctly for "en-US"', () => {
      mockLocalizationService.currentCulture = 'en-US';
      const anotherDate = new Date(2024, 11, 5); // December 5, 2024
      expect(pipe.transform(anotherDate)).toBe('December 2024');
    });
  });

  describe('String input', () => {
    it('should format an ISO date string ("2023-03-25T10:00:00Z") for "en-US"', () => {
      mockLocalizationService.currentCulture = 'en-US';
      const dateString = '2023-03-25T10:00:00Z'; // March 25, 2023
      expect(pipe.transform(dateString)).toBe('March 2023');
    });

    it('should format a "yyyy-MM-dd" date string for "es-ES"', () => {
      mockLocalizationService.currentCulture = 'es-ES';
      const dateString = '2022-11-05'; // November 05, 2022
      expect(pipe.transform(dateString)).toBe('noviembre de 2022');
    });
    
    it('should format a "MM/DD/YYYY" date string for "en-GB" (British English)', () => {
      mockLocalizationService.currentCulture = 'en-GB'; 
      const dateString = '07/15/2024'; // July 15, 2024
      // `new Date('MM/DD/YYYY')` is parsed based on browser's locale, might be ambiguous.
      // For reliable parsing from string, ISO format is preferred.
      // If input is '07/15/2024', `new Date()` in a US environment treats it as July 15.
      // In a GB environment, it might be invalid or different.
      // Assuming test environment parses it as July 15.
      expect(pipe.transform(dateString)).toBe('July 2024');
    });
  });

  it('should handle date strings parsed by `new Date()` based on system locale if not ISO', () => {
    // `new Date(value)` behavior for non-ISO strings is implementation-dependent.
    // Prefer ISO strings or Date objects as input to the pipe for consistency.
    mockLocalizationService.currentCulture = 'en-US';
    // Example: '2023-05-10' is ISO-like and generally safe.
    expect(pipe.transform('2023-05-10')).toBe('May 2023'); 
  });
});
