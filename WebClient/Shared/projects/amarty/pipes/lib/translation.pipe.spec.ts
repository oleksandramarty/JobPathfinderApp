import { TranslationPipe } from './translation.pipe';
import { LocalizationService } from '@amarty/services';
import { ChangeDetectorRef } from '@angular/core'; // Pipe is pure:false

// Mock LocalizationService
class MockLocalizationService {
  getTranslation = jest.fn((key: string) => {
    // Define mock translations
    const translations: { [key: string]: string } = {
      'GREETING': 'Hello',
      'FAREWELL': 'Goodbye',
      'KEY_WITH_EMPTY_ACTUAL_TRANSLATION': '' // Key exists, but its translation is empty
    };
    return translations[key]; // Returns undefined if key is not in mock
  });
}

describe('TranslationPipe', () => {
  let pipe: TranslationPipe;
  let mockLocalizationService: MockLocalizationService;

  beforeEach(() => {
    mockLocalizationService = new MockLocalizationService();
    // The pipe's constructor only takes LocalizationService.
    // Angular handles re-evaluation for `pure: false` pipes during change detection.
    pipe = new TranslationPipe(mockLocalizationService as any);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if key is undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(mockLocalizationService.getTranslation).not.toHaveBeenCalled();
  });
  
  it('should return an empty string if key is an empty string', () => {
    expect(pipe.transform('')).toBe('');
    expect(mockLocalizationService.getTranslation).not.toHaveBeenCalled();
  });

  it('should return the translated string if key exists and translation is non-empty', () => {
    const key = 'GREETING';
    expect(pipe.transform(key)).toBe('Hello');
    expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith(key);
  });

  it('should return the key itself if translation is not found (service returns undefined)', () => {
    const key = 'UNKNOWN_KEY';
    expect(pipe.transform(key)).toBe(key);
    expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith(key);
  });
  
  it('should return the key itself if translation is an empty string (and key itself is not empty)', () => {
    // This tests the `translation || key` part of the pipe.
    // If `localizationService.getTranslation(key)` returns `''` (an empty string, which is falsy in JS boolean context),
    // the pipe should return the `key` itself.
    const key = 'KEY_WITH_EMPTY_ACTUAL_TRANSLATION';
    expect(pipe.transform(key)).toBe(key); 
    expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith(key);
  });

  // The `pure: false` attribute means Angular re-evaluates the pipe during every change detection cycle
  // if its inputs change or if other bindings in the component change.
  // Unit testing this specific aspect of `pure: false` is more about the integration with Angular's
  // change detection, typically observed in component tests.
  // The pipe's own unit test should focus on the correctness of its `transform` logic given its dependencies.
});
