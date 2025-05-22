import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { DictionaryApiClient, API_BASE_URL_Dictionaries } from './dictionary-api.service';
import { SiteSettingsResponse, ErrorMessageModel, throwException } from '@amarty/models'; 


describe('DictionaryApiClient', () => {
  let service: DictionaryApiClient;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://test-api.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiClient,
        { provide: API_BASE_URL_Dictionaries, useValue: mockBaseUrl }
      ]
    });
    service = TestBed.inject(DictionaryApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('localization_DictionaryVersion', () => {
    const expectedUrl = `${mockBaseUrl}/api/Localization/version`;

    it('should return SiteSettingsResponse on successful GET request (200)', () => {
      const mockResponseDataJson = { 
        version: { localizationPublic: '1.0', localization: '1.0' } 
      };
      // NSwag generated client expects to parse this from JSON
      const mockResponseData = SiteSettingsResponse.fromJS(mockResponseDataJson);


      service.localization_DictionaryVersion().subscribe(response => {
        expect(response).toEqual(mockResponseData);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponseDataJson); // Flush the JSON, service will call fromJS
    });

    const errorCodes = [400, 401, 403, 404, 409, 417, 500];
    errorCodes.forEach(errorCode => {
      it(`should handle HTTP error ${errorCode} and throw ErrorMessageModel`, () => {
        const mockErrorJson = { 
            message: `Error ${errorCode}`, 
            statusCode: errorCode 
        };
        // NSwag will parse this into ErrorMessageModel if defined for the status code
        // The actual error thrown by throwException is an Error object with 'result' property
        
        service.localization_DictionaryVersion().subscribe({
          next: () => fail(`should have failed with ${errorCode} error`),
          error: (error: any) => { 
            expect(error.status).toBe(errorCode); // Check status on the error object
            expect(error.result).toBeInstanceOf(ErrorMessageModel); // The parsed error is in 'result'
            expect(error.result.message).toBe(`Error ${errorCode}`);
            expect(error.result.statusCode).toBe(errorCode);
          }
        });

        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockErrorJson, { status: errorCode, statusText: `Server Error ${errorCode}` });
      });
    });
    
    it('should handle unexpected HTTP error (e.g., 503) and throw generic error message', () => {
        const unexpectedStatus = 503;
        const statusText = "Service Unavailable";

        service.localization_DictionaryVersion().subscribe({
          next: () => fail('should have failed with an unexpected error'),
          error: (error: any) => { 
            expect(error.status).toBe(unexpectedStatus);
            expect(error.message).toContain("An unexpected server error occurred.");
            // For undefined error structures, NSwag might not parse into ErrorMessageModel
            // but the throwException function itself might be what's returned by the observable.
            // The test should reflect how NSwag's throwException behaves.
            expect(error.response).toBeDefined(); // The textual response from server
          }
        });

        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
        req.flush("Server is down", { status: unexpectedStatus, statusText: statusText });
    });

    it('should handle network error', () => {
        service.localization_DictionaryVersion().subscribe({
          next: () => fail('should have failed due to network error'),
          error: (error) => {
            // Angular's HttpClient wraps network errors in HttpErrorResponse with status 0
            // or the error event itself if not an HttpErrorResponse.
            // NSwag might further wrap this.
            expect(error).toBeTruthy(); // Check that an error is thrown
            // More specific checks depend on NSwag's error handling for network issues
          }
        });
    
        const req = httpMock.expectOne(expectedUrl);
        req.error(new ProgressEvent('network_error')); // Simulate network error
      });
  });
});
