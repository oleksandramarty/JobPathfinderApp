import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KarmaAreaComponent } from './karma-area.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationPipe } from '@amarty/pipes'; // Assuming this path

// Attempt to create a mock for TranslationPipe that is also standalone
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate', // Ensure this matches the pipe's actual name if used in template
  standalone: true,
})
class MockTranslationPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return value + (args.length > 0 ? ':' + args.join(',') : ''); // Basic mock behavior
  }
}

describe('KarmaAreaComponent', () => {
  let component: KarmaAreaComponent;
  let fixture: ComponentFixture<KarmaAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KarmaAreaComponent, NoopAnimationsModule],
    })
    .overrideComponent(KarmaAreaComponent, {
      remove: { imports: [TranslationPipe] }, // Remove the original
      add: { imports: [MockTranslationPipe] }    // Add the mock standalone pipe
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarmaAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
