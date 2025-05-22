import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';

import { ProfileRedirectComponent } from './profile-redirect.component';
import { selectUser, UserResponse } from '@amarty/store'; // Assuming UserResponse is the correct type from store
import { CommonModule } from '@angular/common';

// Mock for Router
class MockRouter {
  navigate = jest.fn();
}

// Mock for Store
class MockStore {
  private userSubject = new BehaviorSubject<UserResponse | null | undefined>(undefined);
  select = jest.fn((selector: any) => {
    if (selector === selectUser) {
      return this.userSubject.asObservable();
    }
    return of(null);
  });

  // Helper to simulate user state
  setUser(user: UserResponse | null | undefined) {
    this.userSubject.next(user);
  }
}

describe('ProfileRedirectComponent', () => {
  let component: ProfileRedirectComponent;
  let fixture: ComponentFixture<ProfileRedirectComponent>;
  let mockRouter: MockRouter;
  let mockStore: MockStore;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockStore = new MockStore();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule, // ProfileRedirectComponent imports RouterModule
        ProfileRedirectComponent // The standalone component
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileRedirectComponent);
    component = fixture.componentInstance;
    // ngOnInit will be called by fixture.detectChanges() or manually if needed earlier
  });

  it('should create', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(component).toBeTruthy();
  });

  it('should navigate to /profile/:login if user is logged in', fakeAsync(() => {
    const testUser: UserResponse = { id: '1', login: 'testuser', email: 'test@example.com' };
    mockStore.setUser(testUser);
    
    fixture.detectChanges(); // Trigger ngOnInit and subscription
    tick(); // Allow async operations like subscription and navigation to complete

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile', 'testuser']);
  }));

  it('should navigate to /auth/sign-in if user is not logged in (user is null)', fakeAsync(() => {
    mockStore.setUser(null);

    fixture.detectChanges(); // Trigger ngOnInit and subscription
    tick(); // Allow async operations

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  }));
  
  it('should navigate to /auth/sign-in if user is not logged in (user is undefined)', fakeAsync(() => {
    mockStore.setUser(undefined);

    fixture.detectChanges(); // Trigger ngOnInit and subscription
    tick(); // Allow async operations

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  }));
  
  it('should unsubscribe on destroy', fakeAsync(() => {
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');

    mockStore.setUser(null);
    fixture.detectChanges(); // ngOnInit
    tick();

    fixture.destroy(); // ngOnDestroy
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  }));
});
