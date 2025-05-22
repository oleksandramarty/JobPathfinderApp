import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { BaseUrlInterceptor } from './api.interceptor'; // Using the actual class name
import { JwtTokenResponse } from '@amarty/models';
import { environment } from './environments/environment';
import * as utils from '@amarty/utils'; // To mock its functions
import { auth_clearAll, profile_clearAll } from '@amarty/store';

// Mock AuthService
class MockAuthService {
  localToken: JwtTokenResponse | null = null;
}

// Mock Store
class MockStore {
  dispatch = jest.fn();
}

// Spy on utils module
jest.mock('@amarty/utils', () => ({
  getLocalStorageItem: jest.fn(),
  clearLocalStorageAndRefresh: jest.fn(),
}));

describe('BaseUrlInterceptor (ApiInterceptor)', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockAuthService: MockAuthService;
  let mockStore: MockStore;

  const testUrl = '/test-api';
  const mockTokenValue = 'mock-jwt-token';

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockStore = new MockStore();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Store, useValue: mockStore },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('should be created', () => {
    const interceptor: BaseUrlInterceptor = TestBed.inject(BaseUrlInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists in AuthService.localToken', () => {
    mockAuthService.localToken = { token: mockTokenValue, expiration: '', login: 'test' };

    httpClient.get(testUrl).subscribe();

    const httpRequest = httpMock.expectOne(testUrl);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe(`${environment.authSchema} ${mockTokenValue}`);
    httpRequest.flush({}); // Complete the request
  });

  it('should add Authorization header if token exists in localStorage (and not in localToken)', () => {
    mockAuthService.localToken = null;
    (utils.getLocalStorageItem as jest.Mock).mockReturnValue({ token: mockTokenValue, expiration: '', login: 'test' });

    httpClient.get(testUrl).subscribe();

    const httpRequest = httpMock.expectOne(testUrl);
    expect(utils.getLocalStorageItem).toHaveBeenCalledWith('honk_token');
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe(`${environment.authSchema} ${mockTokenValue}`);
    httpRequest.flush({});
  });

  it('should not add Authorization header if no token exists', () => {
    mockAuthService.localToken = null;
    (utils.getLocalStorageItem as jest.Mock).mockReturnValue(null);

    httpClient.get(testUrl).subscribe();

    const httpRequest = httpMock.expectOne(testUrl);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
    httpRequest.flush({});
  });

  it('should handle 401 error by dispatching actions and clearing storage', () => {
    mockAuthService.localToken = { token: mockTokenValue, expiration: '', login: 'test' };

    httpClient.get(testUrl).subscribe({
      error: (err) => {
        expect(err instanceof HttpErrorResponse).toBe(true);
        expect(err.status).toBe(401);
      },
    });

    const httpRequest = httpMock.expectOne(testUrl);
    httpRequest.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(mockStore.dispatch).toHaveBeenCalledWith(auth_clearAll());
    expect(mockStore.dispatch).toHaveBeenCalledWith(profile_clearAll());
    expect(utils.clearLocalStorageAndRefresh).toHaveBeenCalledWith(true);
  });
  
  it('should log other errors and re-throw (e.g., 500)', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn for this test

    httpClient.get(testUrl).subscribe({
      error: (err) => {
        expect(err instanceof HttpErrorResponse).toBe(true);
        expect(err.status).toBe(500);
      },
    });

    const httpRequest = httpMock.expectOne(testUrl);
    httpRequest.flush({}, { status: 500, statusText: 'Server Error' });

    expect(mockStore.dispatch).not.toHaveBeenCalled();
    expect(utils.clearLocalStorageAndRefresh).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should log 404 error and re-throw', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn

    httpClient.get(testUrl).subscribe({
      error: (err) => {
        expect(err instanceof HttpErrorResponse).toBe(true);
        expect(err.status).toBe(404);
      },
    });

    const httpRequest = httpMock.expectOne(testUrl);
    httpRequest.flush({}, { status: 404, statusText: 'Not Found' });
    
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    expect(utils.clearLocalStorageAndRefresh).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Entity not found:', expect.any(String));
    
    consoleWarnSpy.mockRestore();
  });
});
