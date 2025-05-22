import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { BaseUnsubscribeComponent } from './base-unsubscribe.compoinent'; // Note the typo in the import path

// Dummy component for testing the abstract base class
@Component({
  selector: 'app-test-host', // Selector is good practice for host components in tests
  template: '',
  standalone: true, 
})
class TestHostComponent extends BaseUnsubscribeComponent implements OnInit, OnDestroy {
  constructor() {
    super();
  }

  public getUnsubscribeSubject(): Subject<void> {
    return this.ngUnsubscribe;
  }
}

describe('BaseUnsubscribeComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent] // Import the standalone TestHostComponent
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit of TestHostComponent and BaseUnsubscribeComponent
  });

  it('should create an instance of the host component extending BaseUnsubscribeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have an ngUnsubscribe Subject defined and not initially stopped', () => {
    const ngUnsubscribeSubject = component.getUnsubscribeSubject();
    expect(ngUnsubscribeSubject).toBeDefined();
    expect(ngUnsubscribeSubject instanceof Subject).toBe(true);
    expect(ngUnsubscribeSubject.isStopped).toBe(false);
  });

  it('should call ngOnInit (even if empty in base, it is part of Angular lifecycle)', () => {
    const ngOnInitSpy = jest.spyOn(component, 'ngOnInit');
    // ngOnInit is called by fixture.detectChanges() in beforeEach.
    // To test it explicitly again or ensure it was called:
    expect(ngOnInitSpy).toHaveBeenCalled(); 
  });

  describe('ngOnDestroy', () => {
    let ngUnsubscribeSubject: Subject<void>;
    let nextSpy: jest.SpyInstance;
    let completeSpy: jest.SpyInstance;

    beforeEach(() => {
      ngUnsubscribeSubject = component.getUnsubscribeSubject();
      nextSpy = jest.spyOn(ngUnsubscribeSubject, 'next');
      completeSpy = jest.spyOn(ngUnsubscribeSubject, 'complete');
    });

    it('should call next() on ngUnsubscribe', () => {
      component.ngOnDestroy(); // or fixture.destroy()
      expect(nextSpy).toHaveBeenCalled();
    });

    it('should call complete() on ngUnsubscribe', () => {
      component.ngOnDestroy(); // or fixture.destroy()
      expect(completeSpy).toHaveBeenCalled();
    });

    it('ngUnsubscribe subject should be stopped (closed) after ngOnDestroy', () => {
      expect(ngUnsubscribeSubject.isStopped).toBe(false); 
      component.ngOnDestroy(); // or fixture.destroy()
      expect(ngUnsubscribeSubject.isStopped).toBe(true);
    });
  });
});
