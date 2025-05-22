import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocalizationApiClient, API_BASE_URL_Localizations } from './localization-api.service';
import { LocalizationsResponse, ErrorMessageModel } from '@amarty/models';

describe('LocalizationApiClient', () => {
  let service: LocalizationApiClient;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://test-localization-api.com';
  const testVersion = 'v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocalizationApiClient,
        { provide: API_BASE_URL_Localizations, useValue: mockBaseUrl }
      ]
    });
    service = TestBed.inject(LocalizationApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('localization_NonPublicLocalization', () => {
    const expectedUrl = `${mockBaseUrl}/api/Localization/${testVersion}`;

    it('should return LocalizationsResponse on successful GET request (200)', () => {
      const mockResponseDataJson = { data: [{ locale: 'en', items: [{key: 'test', value: 'Test'}] }] };
      const mockResponseData = LocalizationsResponse.fromJS(mockResponseDataJson);

      service.localization_NonPublicLocalization(testVersion).subscribe(response => {
        expect(response).toEqual(mockResponseData);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponseDataJson);
    });

    it('should throw an error if version parameter is undefined', () => {
      expect(() => service.localization_NonPublicLocalization(undefined as any))
        .toThrow(new Error("The parameter 'version' must be defined."));
    });
    
    const errorCodes = [400, 401, 403, 404, 409, 417, 500];
    errorCodes.forEach(errorCode => {
      it(`should handle HTTP error ${errorCode} for non-public localizations`, () => {
        const mockErrorJson = { message: `Error ${errorCode}`, statusCode: errorCode };
        
        service.localization_NonPublicLocalization(testVersion).subscribe({
          next: () => fail(`should have failed with ${errorCode} error`),
          error: (error: any) => {
            expect(error.status).toBe(errorCode);
            expect(error.result).toBeInstanceOf(ErrorMessageModel);
            expect(error.result.message).toBe(`Error ${errorCode}`);
          }
        });

        const req = httpMock.expectOne(expectedUrl);
        req.flush(mockErrorJson, { status: errorCode, statusText: `Server Error ${errorCode}` });
      });
    });
  });

  describe('localization_PublicLocalizations', () => {
    const expectedUrl = `${mockBaseUrl}/api/Localization/public/${testVersion}`;

    it('should return LocalizationsResponse on successful GET request (200)', () => {
      const mockResponseDataJson = { data: [{ locale: 'en', items: [{key: 'public_test', value: 'Public Test'}] }] };
      const mockResponseData = LocalizationsResponse.fromJS(mockResponseDataJson);

      service.localization_PublicLocalizations(testVersion).subscribe(response => {
        expect(response).toEqual(mockResponseData);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponseDataJson);
    });
    
    it('should throw an error if version parameter is null', () => {
      expect(() => service.localization_PublicLocalizations(null as any))
        .toThrow(new Error("The parameter 'version' must be defined."));
    });

    const errorCodes = [400, 401, 403, 404, 409, 417, 500];
    errorCodes.forEach(errorCode => {
      it(`should handle HTTP error ${errorCode} for public localizations`, () => {
        const mockErrorJson = { message: `Error ${errorCode}`, statusCode: errorCode };

        service.localization_PublicLocalizations(testVersion).subscribe({
          next: () => fail(`should have failed with ${errorCode} error`),
          error: (error: any) => {
            expect(error.status).toBe(errorCode);
            expect(error.result).toBeInstanceOf(ErrorMessageModel);
            expect(error.result.message).toBe(`Error ${errorCode}`);
          }
        });

        const req = httpMock.expectOne(expectedUrl);
        req.flush(mockErrorJson, { status: errorCode, statusText: `Server Error ${errorCode}` });
      });
    });
  });
});
