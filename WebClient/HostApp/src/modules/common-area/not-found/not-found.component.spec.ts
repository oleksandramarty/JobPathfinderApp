import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, of } from 'rxjs';

import { NotFoundComponent } from './not-found.component';
import { AuthService } from '../../../utils/services/auth.service';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { TranslationPipe } from '@amarty/pipes';
import { Pipe, PipeTransform } from '@angular/core'; // For mocking pipe

// Mock TranslationPipe
@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    // For testing, return the key or a simple transformation
    return value ? value.toString() : '';
  }
}

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockAuthService: Partial<AuthService>;
  let isAuthorizedSubject: Subject<boolean>;

  beforeEach(async () => {
    isAuthorizedSubject = new Subject<boolean>();
    mockAuthService = {
      isAuthorized$: isAuthorizedSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        NotFoundComponent, 
        RouterTestingModule, 
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
    .overrideComponent(NotFoundComponent, {
        remove: { imports: [TranslationPipe] },
        add: { imports: [MockTranslatePipe] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
  });

  describe('isAuthorized$ getter', () => {
    it('should return true when authService.isAuthorized$ emits true', (done) => {
      fixture.detectChanges();
      component.isAuthorized$.subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      isAuthorizedSubject.next(true);
    });

    it('should return false when authService.isAuthorized$ emits false', (done) => {
      fixture.detectChanges();
      component.isAuthorized$.subscribe(value => {
        expect(value).toBe(false);
        done();
      });
      isAuthorizedSubject.next(false);
    });

    it('should default to of(false) if authService.isAuthorized$ is undefined', (done) => {
      (mockAuthService as any).isAuthorized$ = undefined; 
      TestBed.resetTestingModule(); 
       TestBed.configureTestingModule({
        imports: [NotFoundComponent, RouterTestingModule],
        providers: [{ provide: AuthService, useValue: mockAuthService }],
      }).overrideComponent(NotFoundComponent, { 
        remove: {imports: [TranslationPipe]},
        add: {imports: [MockTranslatePipe]}
      }).compileComponents();
      
      fixture = TestBed.createComponent(NotFoundComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();


      component.isAuthorized$.subscribe(value => {
        expect(value).toBe(false);
        done();
      });
    });
  });

  describe('Template Rendering', () => {
    it('should display "Page Not Found" title', () => {
      fixture.detectChanges();
      const titleElement = fixture.nativeElement.querySelector('h1');
      expect(titleElement.textContent).toContain(LOCALIZATION_KEYS.COMMON.PAGE_NOT_FOUND);
    });

    it('should display "Go to Home" link when authorized', fakeAsync(() => {
      fixture.detectChanges(); 
      isAuthorizedSubject.next(true);
      tick(); 
      fixture.detectChanges(); 

      const linkElement = fixture.nativeElement.querySelector('a.btn');
      expect(linkElement).toBeTruthy();
      expect(linkElement.getAttribute('routerLink')).toBe('/home');
      expect(linkElement.textContent).toContain(LOCALIZATION_KEYS.COMMON.GO_TO_HOME_PAGE);
    }));

    it('should display "Go to Sign In" link when not authorized', fakeAsync(() => {
      fixture.detectChanges(); 
      isAuthorizedSubject.next(false);
      tick(); 
      fixture.detectChanges(); 

      const linkElement = fixture.nativeElement.querySelector('a.btn');
      expect(linkElement).toBeTruthy();
      expect(linkElement.getAttribute('routerLink')).toBe('/auth/sign-in');
      expect(linkElement.textContent).toContain(LOCALIZATION_KEYS.COMMON.GO_TO_SIGN_IN_PAGE);
    }));
    
    it('should display the 404 image', () => {
        fixture.detectChanges();
        const imgElement = fixture.nativeElement.querySelector('img[alt="Not Found"]');
        expect(imgElement).toBeTruthy();
        expect(imgElement.getAttribute('src')).toBe('assets/images/errors/404.svg');
    });
  });
  
  it('should have LOCALIZATION_KEYS defined', () => {
    fixture.detectChanges();
    expect((component as any).LOCALIZATION_KEYS).toBe(LOCALIZATION_KEYS);
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges(); 
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    component.ngOnDestroy(); 
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
