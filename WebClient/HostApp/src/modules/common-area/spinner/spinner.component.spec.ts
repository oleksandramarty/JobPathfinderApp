import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject, of } from 'rxjs';

import { SpinnerComponent } from './spinner.component';
import { LoaderService } from '@amarty/services';
import { CommonModule } from '@angular/common'; 

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let mockLoaderService: Partial<LoaderService>;
  let loaderIsBusySubject: Subject<boolean>;

  beforeEach(async () => {
    loaderIsBusySubject = new Subject<boolean>();
    mockLoaderService = {
      loaderIsBusyChanged$: loaderIsBusySubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        SpinnerComponent, 
        NoopAnimationsModule, 
        // MatProgressSpinnerModule and CommonModule are imported by SpinnerComponent directly
      ],
      providers: [
        { provide: LoaderService, useValue: mockLoaderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and LoaderService interaction', () => {
    it('should subscribe to loaderIsBusyChanged$ and update isBusy', () => {
      fixture.detectChanges(); 
      loaderIsBusySubject.next(true);
      expect(component.isBusy).toBe(true);

      loaderIsBusySubject.next(false);
      expect(component.isBusy).toBe(false);
    });

    it('should call _startTimer when isBusy becomes true', () => {
      const startTimerSpy = jest.spyOn(component as any, '_startTimer');
      fixture.detectChanges(); 
      
      loaderIsBusySubject.next(true);
      
      expect(startTimerSpy).toHaveBeenCalled();
    });

    it('should call _stopTimer when isBusy becomes false', () => {
      fixture.detectChanges(); 
      loaderIsBusySubject.next(true); 

      const stopTimerSpy = jest.spyOn(component as any, '_stopTimer');
      loaderIsBusySubject.next(false);
      
      expect(stopTimerSpy).toHaveBeenCalled();
    });
  });

  describe('_startTimer and _stopTimer (loading message animation)', () => {
    it('_startTimer should start an interval that updates speakerLoadingIndex', fakeAsync(() => {
      fixture.detectChanges(); 
      loaderIsBusySubject.next(true); 

      const initialIndex = component.speakerLoadingIndex;
      
      tick(3000); 
      tick(100);  
      expect(component.speakerLoadingIndex).not.toBe(initialIndex);
      expect(component.speakerLoadingIndex).toBe((initialIndex + 1) % component.speakerLoadingArray.length);

      component.ngOnDestroy(); 
      tick(3100); 
    }));

    it('_stopTimer should stop the interval', fakeAsync(() => {
      fixture.detectChanges(); 
      loaderIsBusySubject.next(true); 

      const initialIndex = component.speakerLoadingIndex;
      tick(1500); 

      (component as any)._stopTimer(); 
      
      const indexAfterStop = component.speakerLoadingIndex;
      tick(3000); 
      tick(100);
      expect(component.speakerLoadingIndex).toBe(indexAfterStop);

      component.ngOnDestroy(); 
    }));
  });
  
  describe('Template Rendering', () => {
    it('should display the overlay and spinner when isBusy is true', () => {
      fixture.detectChanges(); 
      component.isBusy = true;
      fixture.detectChanges(); 

      const overlayDiv = fixture.nativeElement.querySelector('.overlay');
      const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
      const loadingMessage = fixture.nativeElement.querySelector('.loading-text p');
      
      expect(overlayDiv).toBeTruthy();
      expect(spinnerElement).toBeTruthy();
      expect(loadingMessage).toBeTruthy();
      if (component.speakerLoadingArray.length > 0) { // Check if array is not empty
        expect(loadingMessage.textContent).toContain(component.speakerLoadingArray[component.speakerLoadingIndex]);
      }
    });

    it('should not display the overlay and spinner when isBusy is false', () => {
      fixture.detectChanges(); 
      component.isBusy = false;
      fixture.detectChanges(); 

      const overlayDiv = fixture.nativeElement.querySelector('.overlay');
      expect(overlayDiv).toBeFalsy();
    });
    
    it('should apply the diameter input to mat-spinner', () => {
        const testDiameter = 50;
        component.diameter = testDiameter;
        component.isBusy = true;
        fixture.detectChanges();
        
        const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
        // Using ng-reflect-diameter as a way to check passed input for Material components
        expect(spinnerElement.getAttribute('ng-reflect-diameter')).toBe(String(testDiameter)); 
    });
  });

  it('ngOnDestroy should call _stopTimer and complete timerUnsubscribe$', () => {
    fixture.detectChanges(); 
    const stopTimerSpy = jest.spyOn(component as any, '_stopTimer');
    const timerUnsubscribeCompleteSpy = jest.spyOn((component as any).timerUnsubscribe$, 'complete');
    const baseNgOnDestroySpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(component)), 'ngOnDestroy'); // Access BaseUnsubscribeComponent's ngOnDestroy

    component.ngOnDestroy();

    expect(stopTimerSpy).toHaveBeenCalled();
    expect(timerUnsubscribeCompleteSpy).toHaveBeenCalled();
    expect(baseNgOnDestroySpy).toHaveBeenCalled(); 
  });
});
