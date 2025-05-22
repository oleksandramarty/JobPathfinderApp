import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // For router-outlet
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, of } from 'rxjs';

import { AuthAreaComponent } from './auth-area.component';
import { AuthService } from '../../../utils/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // For MatSnackBar if not fully mocked

describe('AuthAreaComponent', () => {
  let component: AuthAreaComponent;
  let fixture: ComponentFixture<AuthAreaComponent>;
  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;
  let mockSnackBar: Partial<MatSnackBar>;
  let isAuthorizedSubject: Subject<boolean>;

  beforeEach(async () => {
    isAuthorizedSubject = new Subject<boolean>();
    mockAuthService = {
      isAuthorized$: isAuthorizedSubject.asObservable(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };
    
    mockSnackBar = { 
        open: jest.fn() 
    };

    await TestBed.configureTestingModule({
      imports: [
        AuthAreaComponent, // Component is standalone
        RouterTestingModule, // For <router-outlet>
        NoopAnimationsModule, // MatSnackBarModule is in component's imports, Noop for testing
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }, // Provide mock for MatSnackBar
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthAreaComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // ngOnInit is not present, logic is in constructor
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home if user becomes authorized', fakeAsync(() => {
    isAuthorizedSubject.next(true); // Emit true
    tick(); // Process the observable emission and tap operator

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should NOT navigate to /home if user is not authorized', fakeAsync(() => {
    isAuthorizedSubject.next(false); // Emit false
    tick();

    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/home']);
  }));
  
  it('should navigate to /home if user is already authorized on instantiation (if isAuthorized$ emits synchronously with true)', fakeAsync(() => {
    // This test relies on isAuthorized$ emitting true upon subscription
    // If it's a BehaviorSubject initialized to true, this would pass.
    // With a Subject, the emission must happen after subscription.
    isAuthorizedSubject.next(true);
    tick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  }));


  it('should contain a router-outlet in its template', () => {
    fixture.detectChanges(); // To render the template
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
  
  it('should unsubscribe from isAuthorized$ on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const completeSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    // Ensure subscription happens
    isAuthorizedSubject.next(false); // Initial emission to ensure subscription is active

    fixture.destroy(); // This will trigger ngOnDestroy

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
