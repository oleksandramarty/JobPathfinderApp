import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu'; 
import { Subject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../../utils/services/auth.service';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { LocaleResponse, MenuItem } from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { TranslationPipe } from '@amarty/pipes'; // Import if you want to mock it specifically or declare it

// Mock TranslationPipe if it's not declared in testing module and is standalone
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    // Return the key itself or a simple transformation for testing purposes
    return value ? value.toString() : '';
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let mockAuthService: Partial<AuthService>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockDictionaryService: Partial<DictionaryService>;
  let isAuthorizedSubject: Subject<boolean>;

  const mockLocales: LocaleResponse[] = [
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'fr', name: 'French', flag: 'fr' },
  ];

  beforeEach(async () => {
    isAuthorizedSubject = new Subject<boolean>();

    mockAuthService = {
      isAuthorized$: isAuthorizedSubject.asObservable(),
      logout: jest.fn(),
    };

    mockLocalizationService = {
      currentLocale: 'en', 
      handleLocalizationMenuItems: jest.fn(),
      localeChanged: jest.fn(),
    };

    mockDictionaryService = {
      localeData: mockLocales,
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent, 
        RouterTestingModule,
        NoopAnimationsModule,
        MatMenuModule, 
        // If TranslationPipe is used in template and is standalone, HeaderComponent imports it.
        // If we need to provide a mock specifically at this level, it can be done via providers
        // or by overriding the component's imports if the real one causes issues.
        // Since HeaderComponent imports TranslationPipe, we rely on that or provide a mock.
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: DictionaryService, useValue: mockDictionaryService },
         // { provide: TranslationPipe, useClass: MockTranslatePipe } // Example if providing mock
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    })
    // Example of overriding component's imports if needed:
    // .overrideComponent(HeaderComponent, {
    //   remove: {imports: [TranslationPipe]},
    //   add: {imports: [MockTranslatePipe]}
    // })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set locales from dictionaryService', () => {
      fixture.detectChanges();
      expect(component.locales).toEqual(mockLocales);
    });

    it('should call handleLocalizationMenuItems if currentLocale is set', () => {
      (mockLocalizationService as any).currentLocale = 'en'; 
      fixture.detectChanges();
      expect(mockLocalizationService.handleLocalizationMenuItems).toHaveBeenCalledWith(component.menuItems, component.ngUnsubscribe);
    });

    it('should NOT call handleLocalizationMenuItems if currentLocale is not set', () => {
      (mockLocalizationService as any).currentLocale = ''; 
      fixture.detectChanges();
      expect(mockLocalizationService.handleLocalizationMenuItems).not.toHaveBeenCalled();
    });
  });

  describe('isAuthorized$ getter', () => {
    it('should return observable from authService.isAuthorized$', (done) => {
      fixture.detectChanges(); 
      component.isAuthorized$.subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      isAuthorizedSubject.next(true);
    });

    it('should default to of(false) if authService.isAuthorized$ is undefined', (done) => {
        (mockAuthService as any).isAuthorized$ = undefined;
        // Recreate component with this specific mock setup for this isolated test case
        TestBed.resetTestingModule(); // Reset current TestBed config
        TestBed.configureTestingModule({
             imports: [HeaderComponent, RouterTestingModule, NoopAnimationsModule, MatMenuModule],
             providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: LocalizationService, useValue: mockLocalizationService },
                { provide: DictionaryService, useValue: mockDictionaryService },
             ],
             schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.isAuthorized$.subscribe(value => {
            expect(value).toBe(false);
            done();
        });
    });
  });
  
  it('currentLocale getter should return value from localizationService', () => {
    (mockLocalizationService as any).currentLocale = 'fr';
    fixture.detectChanges();
    expect(component.currentLocale).toBe('fr');
  });

  describe('logout method', () => {
    it('should call authService.logout', () => {
      fixture.detectChanges();
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });

  describe('localeChanged method', () => {
    it('should call localizationService.localeChanged with the given code', () => {
      fixture.detectChanges();
      component.localeChanged('de');
      expect(mockLocalizationService.localeChanged).toHaveBeenCalledWith('de');
    });
  });
  
  describe('Template Rendering', () => {
    it('should display login and register buttons when not authorized', () => {
        fixture.detectChanges(); 
        isAuthorizedSubject.next(false);
        fixture.detectChanges(); 
        
        const loginButton = fixture.nativeElement.querySelector('a[routerLink="/auth/sign-in"]');
        const registerButton = fixture.nativeElement.querySelector('a[routerLink="/auth/sign-up"]');
        const userMenuButton = fixture.nativeElement.querySelector('button[mat-icon-button][aria-label="User menu"]');
        
        expect(loginButton).toBeTruthy();
        // Using a more robust way to check text content, especially with pipes
        expect(loginButton.innerHTML).toContain(LOCALIZATION_KEYS.AUTH.SIGN_IN.SIGN_IN);
        expect(registerButton).toBeTruthy();
        expect(userMenuButton).toBeFalsy(); 
    });

    it('should display user menu and hide login/register when authorized', () => {
        fixture.detectChanges(); 
        isAuthorizedSubject.next(true);
        fixture.detectChanges(); 
        
        const loginButton = fixture.nativeElement.querySelector('a[routerLink="/auth/sign-in"]');
        const userMenuButton = fixture.nativeElement.querySelector('button[mat-icon-button][aria-label="User menu"]');
        const userAvatar = fixture.nativeElement.querySelector(`img[src="${component.userAvatar}"]`);

        expect(loginButton).toBeFalsy();
        expect(userMenuButton).toBeTruthy();
        expect(userAvatar).toBeTruthy();
    });

    it('should render menu items with correct routerLinks', () => {
        fixture.detectChanges();
        const menuLinks = fixture.nativeElement.querySelectorAll('.navbar-nav .nav-item a.nav-link');
        expect(menuLinks.length).toBe(component.menuItems.length);
        component.menuItems.forEach((item, index) => {
            expect(menuLinks[index].getAttribute('href')).toBe(item.url);
        });
    });
    
    it('should display language selection menu with flags', () => {
        fixture.detectChanges();
        const langMenuTrigger = fixture.nativeElement.querySelector('button[mat-button][aria-label="Language selection"]');
        expect(langMenuTrigger).toBeTruthy();
    });
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
