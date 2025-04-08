import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFormRendererComponent } from './generic-form-renderer.component';

describe('GenericFormRendererComponent', () => {
  let component: GenericFormRendererComponent;
  let fixture: ComponentFixture<GenericFormRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFormRendererComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GenericFormRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
