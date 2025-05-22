import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { GraphQlAuthService } from '../api/services/graph-ql-auth.service';
import { LoaderService, LocalizationService } from '@amarty/services';
import { JwtTokenResponse } from '@amarty/models';
import * as utils from '@amarty/utils';
import {
  auth_clearAll,
  auth_setToken,
  profile_clearAll,
  selectIsAdmin,
  selectIsSuperAdmin,
  selectIsUser,
  selectToken
} from '@amarty/store';

// Mocks for services and utils
jest.mock('@amarty/utils', () => ({
  getLocalStorageItem: jest.fn(),
  removeLocalStorageItem: jest.fn(),
  setLocalStorageItem: jest.fn(),
}));

class MockStore {
  private token = new BehaviorSubject<JwtTokenResponse | undefined>(undefined);
  private isUser = new BehaviorSubject<boolean | undefined>(undefined);
  private isAdmin = new BehaviorSubject<boolean | undefined>(undefined);
  private isSuperAdmin = new BehaviorSubject<boolean | undefined>(undefined);

  dispatch = jest.fn();
  select = jest.fn((selector: any) => {
    if (selector === selectToken) return this.token.asObservable();
    if (selector === selectIsUser) return this.isUser.asObservable();
    if (selector === selectIsAdmin) return this.isAdmin.asObservable();
    if (selector === selectIsSuperAdmin) return this.isSuperAdmin.asObservable();
    return of(undefined);
  });

  // Test helpers
  setTokenData(token: JwtTokenResponse | undefined) { this.token.next(token); } // Renamed to avoid conflict
  setIsUser(val: boolean | undefined) { this.isUser.next(val); }
}

class MockGraphQlAuthService {
  signOut = jest.fn(() => of({})); // Default success
}

class MockLoaderService {
  isBusy = false;
}

class MockLocalizationService {
  handleApiError = jest.fn();
}

class MockRouter {
  navigate = jest.fn();
}

describe('AuthService', () => {
  let service: AuthService;
  let mockStore: MockStore;
  let mockGraphQlAuthService: MockGraphQlAuthService;
  let mockLoaderService: MockLoaderService;
  let mockLocalizationService: MockLocalizationService;
  let mockRouter: MockRouter;

  const testToken: JwtTokenResponse = { token: 'test-token', expiration: '2099-01-01T00:00:00Z', login: 'testuser' };

  beforeEach(() => {
    mockStore = new MockStore();
    mockGraphQlAuthService = new MockGraphQlAuthService();
    mockLoaderService = new MockLoaderService();
    mockLocalizationService = new MockLocalizationService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Store, useValue: mockStore },
        { provide: GraphQlAuthService, useValue: mockGraphQlAuthService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(AuthService);
    (utils.getLocalStorageItem as jest.Mock).mockClear();
    (utils.removeLocalStorageItem as jest.Mock).mockClear();
    (utils.setLocalStorageItem as jest.Mock).mockClear();
    mockStore.dispatch.mockClear(); // Clear dispatch mock as well
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should subscribe to token and role selectors from store', () => {
      expect(mockStore.select).toHaveBeenCalledWith(selectToken);
      expect(mockStore.select).toHaveBeenCalledWith(selectIsUser);
      expect(mockStore.select).toHaveBeenCalledWith(selectIsAdmin);
      expect(mockStore.select).toHaveBeenCalledWith(selectIsSuperAdmin);
    });
  });

  describe('initialize', () => {
    it('should dispatch auth_setToken if localToken exists', () => {
      (utils.getLocalStorageItem as jest.Mock).mockReturnValue(testToken);
      service.initialize(); 
      expect(utils.getLocalStorageItem).toHaveBeenCalledWith('honk_token');
      expect(mockStore.dispatch).toHaveBeenCalledWith(auth_setToken({ token: testToken }));
    });

    it('should clearAuthData if no localToken and no token in store', () => {
      (utils.getLocalStorageItem as jest.Mock).mockReturnValue(undefined);
      mockStore.setTokenData(undefined); 
      const clearAuthDataSpy = jest.spyOn(service as any, 'clearAuthData').mockImplementation(() => {}); // Mock implementation to avoid side effects
      service.initialize();
      expect(clearAuthDataSpy).toHaveBeenCalled();
      clearAuthDataSpy.mockRestore();
    });
    
    it('should not clearAuthData if localToken exists', () => {
      (utils.getLocalStorageItem as jest.Mock).mockReturnValue(testToken);
      const clearAuthDataSpy = jest.spyOn(service as any, 'clearAuthData');
      service.initialize();
      expect(clearAuthDataSpy).not.toHaveBeenCalled();
    });
  });
  
  describe('localToken getter', () => {
    it('should return _localToken if already set', () => {
      (service as any)._localToken = testToken;
      expect(service.localToken).toEqual(testToken);
      expect(utils.getLocalStorageItem).not.toHaveBeenCalled();
    });

    it('should call getLocalStorageItem if _localToken is not set', () => {
      (service as any)._localToken = undefined;
      (utils.getLocalStorageItem as jest.Mock).mockReturnValue(testToken);
      expect(service.localToken).toEqual(testToken);
      expect(utils.getLocalStorageItem).toHaveBeenCalledWith('honk_token');
    });
  });

  describe('isAuthorized getter', () => {
    it('should return true if localToken exists', () => {
        (utils.getLocalStorageItem as jest.Mock).mockReturnValue(testToken);
        (service as any)._localToken = undefined; 
        expect(service.isAuthorized).toBe(true);
    });

    it('should return true if token exists in store (and no localToken)', () => {
        (utils.getLocalStorageItem as jest.Mock).mockReturnValue(undefined);
        (service as any)._localToken = undefined;
        const getTokenFromStoreSpy = jest.spyOn(service as any, 'getTokenFromStore').mockReturnValue(testToken);
        expect(service.isAuthorized).toBe(true);
        getTokenFromStoreSpy.mockRestore();
    });

    it('should return false if no token anywhere', () => {
        (utils.getLocalStorageItem as jest.Mock).mockReturnValue(undefined);
        (service as any)._localToken = undefined;
        const getTokenFromStoreSpy = jest.spyOn(service as any, 'getTokenFromStore').mockReturnValue(undefined);
        expect(service.isAuthorized).toBe(false);
        getTokenFromStoreSpy.mockRestore();
    });
  });

  describe('updateToken', () => {
    it('should call setLocalStorageItem and dispatch auth_setToken', () => {
      service.updateToken(testToken);
      expect(utils.setLocalStorageItem).toHaveBeenCalledWith('honk_token', testToken);
      expect(mockStore.dispatch).toHaveBeenCalledWith(auth_setToken({ token: testToken }));
    });
  });
  
  describe('logout', () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
        mockLoaderService.isBusy = false; 
    });

    it('should set loaderService.isBusy to true initially and false on finalize', (done) => {
      mockGraphQlAuthService.signOut = jest.fn(() => of({}).pipe(finalize(() => {
          expect(mockLoaderService.isBusy).toBe(false); // Check on finalize
          done();
      })));
      service.logout();
      expect(mockLoaderService.isBusy).toBe(true); 
    });

    it('should call graphQlAuthService.signOut, clearAuthData, and navigate on success', () => {
      mockGraphQlAuthService.signOut = jest.fn(() => of({}));
      const clearAuthDataSpy = jest.spyOn(service as any, 'clearAuthData');
      
      service.logout();

      expect(mockGraphQlAuthService.signOut).toHaveBeenCalled();
      expect(clearAuthDataSpy).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    });

    it('should handle API error and set loader to false', (done) => {
      const error = new Error('SignOut Error');
      mockGraphQlAuthService.signOut = jest.fn(() => throwError(() => error).pipe(finalize(() => {
          expect(mockLoaderService.isBusy).toBe(false);
          done();
      })));
      const clearAuthDataSpy = jest.spyOn(service as any, 'clearAuthData');

      service.logout();

      expect(mockGraphQlAuthService.signOut).toHaveBeenCalled();
      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
      expect(clearAuthDataSpy).not.toHaveBeenCalled(); 
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('clearAuthData (private method, tested via public methods like logout or initialize)', () => {
    it('should remove local storage item, clear local token, and dispatch clear actions', () => {
        (service as any).clearAuthData(); 
        expect(utils.removeLocalStorageItem).toHaveBeenCalledWith('honk_token');
        expect((service as any)._localToken).toBeUndefined();
        expect(mockStore.dispatch).toHaveBeenCalledWith(auth_clearAll());
        expect(mockStore.dispatch).toHaveBeenCalledWith(profile_clearAll());
    });
  });
});
