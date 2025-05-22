import { Component, ElementRef, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { TranslationDirective } from './translation.directive';
import { LocalizationService } from '@amarty/services';

// Mock LocalizationService
class MockLocalizationService {
  localeChangedSub = new Subject<boolean>();
  getTranslation = jest.fn((key: string) => `translated-${key}`);
}

// Test Host Component
@Component({
  template: `
    <div id="div1" translation="test.key1">Default Text</div>
    <input id="input1" type="text" translation="test.key2" translationAttr="placeholder" placeholder="Default Placeholder">
    <div id="div2" [translation]="dynamicKey"></div>
    <div id="div3" translation>No Key</div> 
  `,
  standalone: true,
  imports: [TranslationDirective] 
})
class TestHostComponent {
  dynamicKey: string | undefined = 'test.dynamicKey';
}

describe('TranslationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let mockLocalizationService: MockLocalizationService;

  beforeEach(async () => {
    mockLocalizationService = new MockLocalizationService();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent], // TestHostComponent imports TranslationDirective
      providers: [
        { provide: LocalizationService, useValue: mockLocalizationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create an instance of the host component', () => {
    fixture.detectChanges(); 
    expect(hostComponent).toBeTruthy();
  });

  describe('ngOnInit and Initial Translation', () => {
    it('should call updateTranslation and translate if key is provided', () => {
      fixture.detectChanges(); 
      const divWithKey = fixture.nativeElement.querySelector('#div1');
      expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith('test.key1');
      expect(divWithKey.innerText).toBe('translated-test.key1');
    });

    it('should not call getTranslation with undefined key if key is not provided', () => {
      fixture.detectChanges();
      const divNoKey = fixture.nativeElement.querySelector('#div3');
      expect(mockLocalizationService.getTranslation).not.toHaveBeenCalledWith(undefined);
      expect(divNoKey.innerText).toBe('No Key'); // Stays as default
    });
  });

  describe('updateTranslation behavior', () => {
    it('should set innerText by default', () => {
      fixture.detectChanges();
      const divElement = fixture.nativeElement.querySelector('#div1');
      expect(divElement.innerText).toBe('translated-test.key1');
    });

    it('should set placeholder if translationAttr is "placeholder"', () => {
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('#input1') as HTMLInputElement;
      expect(inputElement.placeholder).toBe('translated-test.key2');
    });

    it('should use key as fallback for innerText if translation is not found', () => {
      mockLocalizationService.getTranslation.mockImplementation((key: string) => undefined as any);
      fixture.detectChanges();
      const divElement = fixture.nativeElement.querySelector('#div1');
      expect(divElement.innerText).toBe('test.key1');
    });

    it('should use key as fallback for placeholder if translation is not found', () => {
      mockLocalizationService.getTranslation.mockImplementation((key: string) => undefined as any);
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('#input1') as HTMLInputElement;
      expect(inputElement.placeholder).toBe('test.key2');
    });
  });

  describe('Locale Change Subscription', () => {
    it('should call updateTranslation when localeChangedSub emits true', () => {
      fixture.detectChanges(); 
      mockLocalizationService.getTranslation.mockClear(); 

      mockLocalizationService.localeChangedSub.next(true);
      fixture.detectChanges(); 

      expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith('test.key1');
      expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith('test.key2');
      expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith('test.dynamicKey');
    });
    
    it('should NOT call updateTranslation when localeChangedSub emits false or undefined', () => {
      fixture.detectChanges(); 
      mockLocalizationService.getTranslation.mockClear(); 

      mockLocalizationService.localeChangedSub.next(false as any); 
      fixture.detectChanges(); 
      expect(mockLocalizationService.getTranslation).not.toHaveBeenCalled();
      
      mockLocalizationService.localeChangedSub.next(undefined as any); 
      fixture.detectChanges(); 
      expect(mockLocalizationService.getTranslation).not.toHaveBeenCalled();
    });
  });
  
  describe('Dynamic Key Change', () => {
    // This test confirms current behavior. If key changes should trigger re-translation,
    // the directive would need to implement ngOnChanges.
    it('should not re-translate if @Input key changes without ngOnChanges', () => {
      fixture.detectChanges();
      const dynamicDiv = fixture.nativeElement.querySelector('#div2');
      expect(dynamicDiv.innerText).toBe('translated-test.dynamicKey');
      mockLocalizationService.getTranslation.mockClear();

      hostComponent.dynamicKey = 'test.newDynamicKey';
      fixture.detectChanges(); 
      
      expect(mockLocalizationService.getTranslation).not.toHaveBeenCalledWith('test.newDynamicKey');
      expect(dynamicDiv.innerText).toBe('translated-test.dynamicKey'); 
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete ngUnsubscribe subject to prevent memory leaks', () => {
      fixture.detectChanges(); 
      // Get the directive instance to spy on its ngUnsubscribe
      const directiveDebugElement = fixture.debugElement.query(By.directive(TranslationDirective));
      const directiveInstance = directiveDebugElement.injector.get(TranslationDirective);
      
      const ngUnsubscribeCompleteSpy = jest.spyOn(directiveInstance.ngUnsubscribe, 'complete');
      const ngUnsubscribeNextSpy = jest.spyOn(directiveInstance.ngUnsubscribe, 'next');
      
      fixture.destroy(); // This triggers ngOnDestroy for directives too
      
      expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
      expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
    });
  });
});
