import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2, ElementRef } from '@angular/core';
import { NightSkyComponent } from './night-sky.component';

// Mock Renderer2
class MockRenderer2 {
  selectRootElement = jest.fn().mockImplementation(selector => {
    if (selector === '.stars') {
      const mockElement = document.createElement('div');
      mockElement.className = 'stars-mock'; 
      return mockElement;
    }
    return document.createElement('div'); 
  });
  createElement = jest.fn().mockReturnValue(document.createElement('div'));
  addClass = jest.fn();
  setStyle = jest.fn();
  appendChild = jest.fn();
}

describe('NightSkyComponent', () => {
  let component: NightSkyComponent;
  let fixture: ComponentFixture<NightSkyComponent>;
  let mockRenderer2: MockRenderer2;

  beforeEach(async () => {
    mockRenderer2 = new MockRenderer2();

    await TestBed.configureTestingModule({
      imports: [NightSkyComponent], 
      providers: [
        { provide: Renderer2, useValue: mockRenderer2 },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NightSkyComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call generateStars on ngOnInit', () => {
    const generateStarsSpy = jest.spyOn(component as any, 'generateStars');
    fixture.detectChanges(); 
    expect(generateStarsSpy).toHaveBeenCalled();
  });

  describe('generateStars behavior (via ngOnInit)', () => {
    it('should select the ".stars" container', () => {
      fixture.detectChanges();
      expect(mockRenderer2.selectRootElement).toHaveBeenCalledWith('.stars', true);
    });

    it('should not attempt to create stars if ".stars" container is not found', () => {
      mockRenderer2.selectRootElement.mockReturnValueOnce(undefined); 
      fixture.detectChanges();
      expect(mockRenderer2.createElement).not.toHaveBeenCalled();
    });

    it('should call createStar multiple times if ".stars" container is found', () => {
      const createStarSpy = jest.spyOn(component as any, 'createStar');
      fixture.detectChanges();
      // Check if it's called a number of times reflecting the loops
      // Sum of _starsArray elements * _starsMultiplier * (number of createStar calls per loop iteration)
      // Example: 1st loop: 100 * 1 * 2 = 200; 2nd loop: 30 * 1 * 3 = 90 etc.
      // For simplicity, just check if it's called more than a few times, e.g., > 10
      expect(createStarSpy.mock.calls.length).toBeGreaterThan(10); 
    });
  });
  
  describe('createStar behavior (called by generateStars)', () => {
    let mockStarsContainer: HTMLElement;

    beforeEach(() => {
        mockStarsContainer = document.createElement('div');
        mockRenderer2.selectRootElement.mockReturnValue(mockStarsContainer);
        mockRenderer2.createElement.mockClear();
        mockRenderer2.addClass.mockClear();
        mockRenderer2.setStyle.mockClear();
        mockRenderer2.appendChild.mockClear();
    });

    it('should create a div element for a star', () => {
        fixture.detectChanges(); 
        // Check if createElement was called for any star
        if (component['_starsArray'].some(s => s > 0)) { // Ensure at least one star is expected
            expect(mockRenderer2.createElement).toHaveBeenCalledWith('div');
        }
    });
    
    it('should add correct classes to the star element', () => {
        fixture.detectChanges();
        if (component['_starsArray'].some(s => s > 0)) {
            expect(mockRenderer2.addClass).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'blink');
            expect(mockRenderer2.addClass).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'star');
            expect(mockRenderer2.addClass).toHaveBeenCalledWith(expect.any(HTMLDivElement), expect.stringMatching(/star-\d/));
        }
    });

    it('should set style properties for the star element', () => {
        fixture.detectChanges();
        if (component['_starsArray'].some(s => s > 0)) {
            expect(mockRenderer2.setStyle).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'top', expect.stringMatching(/\d+vh/));
            expect(mockRenderer2.setStyle).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'left', expect.stringMatching(/\d+vw/));
            expect(mockRenderer2.setStyle).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'animation-duration', expect.stringMatching(/\d+ms/));
        }
    });
    
    it('should append the star to the stars container', () => {
        fixture.detectChanges();
        if (component['_starsArray'].some(s => s > 0)) {
            expect(mockRenderer2.appendChild).toHaveBeenCalledWith(mockStarsContainer, expect.any(HTMLDivElement));
        }
    });
  });

  describe('Template structure', () => {
    it('should render the main structural divs', () => {
      fixture.detectChanges();
      const starsDiv = fixture.nativeElement.querySelector('.stars');
      const twinklingDiv = fixture.nativeElement.querySelector('.twinkling');
      const cloudsDiv = fixture.nativeElement.querySelector('.clouds');
      expect(starsDiv).toBeTruthy();
      expect(twinklingDiv).toBeTruthy();
      expect(cloudsDiv).toBeTruthy();
    });
  });
});
