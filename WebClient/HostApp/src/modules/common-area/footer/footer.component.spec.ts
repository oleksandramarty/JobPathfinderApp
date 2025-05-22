import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { FooterComponent } from './footer.component';
import { AuthService } from '../../../utils/services/auth.service';
import { LoaderService } from '@amarty/services';
import * as utils from '@amarty/utils'; 
import { environment } from '../../../utils/environments/environment';
import { auth_clearAll, profile_clearAll } from '@amarty/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';


// Mock localStorage and window.location
let mockLocalStorage: { [key: string]: string | null } = {};
const mockWindowLocation = {
  reload: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(key => mockLocalStorage[key] || null),
    setItem: jest.fn((key, value) => { mockLocalStorage[key] = value as string; }), // Ensure value is string
    removeItem: jest.fn(key => { delete mockLocalStorage[key]; }),
    clear: jest.fn(() => { mockLocalStorage = {}; }),
  },
  writable: true,
});
Object.defineProperty(window, 'location', {
  value: mockWindowLocation,
  writable: true,
});

// Mock @amarty/utils specifically for its localStorage interaction
jest.mock('@amarty/utils', () => {
    const originalUtils = jest.requireActual('@amarty/utils');
    return {
        ...originalUtils,
        getLocalStorageItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setLocalStorageItem: jest.fn((key: string, value: any) => { mockLocalStorage[key] = String(value); }), // Ensure string value
        clearLocalStorageAndRefresh: jest.fn(() => { 
            Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]);
        }),
    };
});


describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  let mockAuthService: Partial<AuthService>;
  let mockStore: Partial<Store>;
  let mockSnackBar: Partial<MatSnackBar>;
  let mockRouter: Partial<Router>;
  let mockLoaderService: Partial<LoaderService>;
  let originalEnvironmentName: string | undefined;

  beforeEach(async () => {
    originalEnvironmentName = environment.name; // Store original environment name
    mockAuthService = {}; 
    mockStore = { dispatch: jest.fn() };
    mockSnackBar = {}; 
    mockRouter = {}; 
    mockLoaderService = { isBusy: true }; 

    mockLocalStorage = {}; // Reset localStorage mock state
    (utils.getLocalStorageItem as jest.Mock).mockClear();
    (utils.setLocalStorageItem as jest.Mock).mockClear();
    (utils.clearLocalStorageAndRefresh as jest.Mock).mockClear();
    mockWindowLocation.reload.mockClear();
    (mockStore.dispatch as jest.Mock).mockClear();


    await TestBed.configureTestingModule({
      imports: [
        FooterComponent, 
        NoopAnimationsModule, 
        MatTooltipModule, 
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Store, useValue: mockStore },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: LoaderService, useValue: mockLoaderService },
      ],
    }).compileComponents();
    
    document.body.className = ''; 
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    environment.name = originalEnvironmentName; // Restore original environment name
    jest.clearAllMocks(); // Clear all other mocks
  });
  
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Constructor and Theme Initialization', () => {
    it('should set default theme to "dark" if no theme in localStorage and apply it', () => {
      (utils.getLocalStorageItem as jest.Mock).mockReturnValue(null);
      document.body.className = '';

      fixture = TestBed.createComponent(FooterComponent); // Recreate for constructor logic
      component = fixture.componentInstance;
      // Constructor calls _toggleTheme

      expect(utils.setLocalStorageItem).toHaveBeenCalledWith('theme', 'dark');
      expect(component.darkTheme).toBe(true);
      expect(document.body.classList.contains('dark-theme')).toBe(true);
      expect(document.body.classList.contains('light-theme')).toBe(false);
    });

    it('should initialize darkTheme to true if localStorage theme is "dark"', () => {
      mockLocalStorage['theme'] = 'dark'; // Set value before component creation
      (utils.getLocalStorageItem as jest.Mock).mockImplementation(key => mockLocalStorage[key] || null);
      document.body.className = '';

      fixture = TestBed.createComponent(FooterComponent);
      component = fixture.componentInstance;
      
      expect(component.darkTheme).toBe(true);
      expect(document.body.classList.contains('dark-theme')).toBe(true);
    });

    it('should initialize darkTheme to false if localStorage theme is "light"', () => {
      mockLocalStorage['theme'] = 'light';
      (utils.getLocalStorageItem as jest.Mock).mockImplementation(key => mockLocalStorage[key] || null);
      document.body.className = '';

      fixture = TestBed.createComponent(FooterComponent);
      component = fixture.componentInstance;

      expect(component.darkTheme).toBe(false);
      expect(document.body.classList.contains('light-theme')).toBe(true);
    });
  });

  describe('ngOnInit', () => {
    it('should sync darkTheme with document.body class list (dark)', () => {
      document.body.className = 'dark-theme'; // Set body class before ngOnInit
      fixture.detectChanges(); // Calls ngOnInit
      expect(component.darkTheme).toBe(true);
    });
    
    it('should sync darkTheme with document.body class list (light)', () => {
      document.body.className = 'light-theme'; // Set body class before ngOnInit
      fixture.detectChanges(); // Calls ngOnInit
      expect(component.darkTheme).toBe(false);
    });
  });

  it('buildVersion getter should return environment name or default', () => {
    environment.name = '1.2.3-test';
    expect(component.buildVersion).toBe('1.2.3-test');
    
    environment.name = undefined; // Test default case
    expect(component.buildVersion).toBe('No version');
  });

  describe('resetSite', () => {
    it('should dispatch clear actions, clear local storage, and reload window', () => {
      component.resetSite();
      expect(mockStore.dispatch).toHaveBeenCalledWith(auth_clearAll());
      expect(mockStore.dispatch).toHaveBeenCalledWith(profile_clearAll());
      expect(utils.clearLocalStorageAndRefresh).toHaveBeenCalledWith(true);
      expect(mockWindowLocation.reload).toHaveBeenCalled();
    });
  });

  it('turnOffLoader should set loaderService.isBusy to false', () => {
    mockLoaderService.isBusy = true;
    component.turnOffLoader();
    expect(mockLoaderService.isBusy).toBe(false);
  });

  describe('toggleTheme and _toggleTheme', () => {
    it('should toggle darkTheme property', () => {
      fixture.detectChanges(); 
      const initialTheme = component.darkTheme;
      component.toggleTheme();
      expect(component.darkTheme).toBe(!initialTheme);
    });

    it('should update localStorage and body classes when toggling to dark', () => {
      component.darkTheme = false; 
      document.body.className = 'light-theme';
      fixture.detectChanges(); // Apply initial state
      
      component.toggleTheme(); // Toggle to dark

      expect(utils.setLocalStorageItem).toHaveBeenCalledWith('theme', 'dark');
      expect(document.body.classList.contains('light-theme')).toBe(false);
      expect(document.body.classList.contains('dark-theme')).toBe(true);
    });

    it('should update localStorage and body classes when toggling to light', () => {
      component.darkTheme = true; 
      document.body.className = 'dark-theme';
      fixture.detectChanges(); // Apply initial state

      component.toggleTheme(); // Toggle to light

      expect(utils.setLocalStorageItem).toHaveBeenCalledWith('theme', 'light');
      expect(document.body.classList.contains('dark-theme')).toBe(false);
      expect(document.body.classList.contains('light-theme')).toBe(true);
    });
  });
  
  describe('Template', () => {
    it('should display the build version', () => {
        environment.name = 'test-version';
        fixture.detectChanges();
        const versionElement = fixture.nativeElement.querySelector('.version-info span');
        expect(versionElement.textContent).toContain('test-version');
    });

    it('should display theme toggle icon based on darkTheme state', () => {
        fixture.detectChanges(); // ngOnInit sets initial theme based on body
        component.darkTheme = true; // Force state for test
        component['_toggleTheme'](); // Apply theme change
        fixture.detectChanges();
        let icon = fixture.nativeElement.querySelector('.theme-toggle i');
        expect(icon.classList.contains('bi-moon-stars-fill')).toBe(true);

        component.darkTheme = false;
        component['_toggleTheme']();
        fixture.detectChanges();
        icon = fixture.nativeElement.querySelector('.theme-toggle i');
        expect(icon.classList.contains('bi-brightness-high-fill')).toBe(true);
    });
    
    it('should have a reset button', () => {
        fixture.detectChanges();
        const resetButton = fixture.nativeElement.querySelector('button[mat-icon-button][matTooltip="Reset Application"]');
        expect(resetButton).toBeTruthy();
    });
  });
});
