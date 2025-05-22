import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs'; // Import BehaviorSubject
import { AuthGuard } from './auth-guard';
import { AuthService } from './services/auth.service';
import { selectToken } from '@amarty/store'; 

// Mock AuthService
class MockAuthService {
  isAuthorized = false; 
}

// Mock Store
class MockStore {
  private tokenSubject = new BehaviorSubject<string | null | undefined>(undefined); // Use BehaviorSubject
  select = jest.fn((selector: any): Observable<string | null | undefined> => {
    if (selector === selectToken) {
      return this.tokenSubject.asObservable();
    }
    return of(undefined); 
  });

  setToken(token: string | null | undefined) {
    this.tokenSubject.next(token);
  }
}

// Mock Router
class MockRouter {
  navigate = jest.fn();
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: MockAuthService;
  let mockStore: MockStore;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockStore = new MockStore();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if token exists in store', (done) => {
    mockStore.setToken('some-token-value');
    mockAuthService.isAuthorized = false; 

    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return true if no token in store but authService.isAuthorized is true', (done) => {
    mockStore.setToken(null);
    mockAuthService.isAuthorized = true;

    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return false and navigate to /auth/sign-in if no token and not authorized', (done) => {
    mockStore.setToken(null);
    mockAuthService.isAuthorized = false;

    guard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
      done();
    });
  });
  
  it('should return false and navigate to /auth/sign-in if token is undefined and not authorized', (done) => {
    mockStore.setToken(undefined);
    mockAuthService.isAuthorized = false;

    guard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
      done();
    });
  });
});
