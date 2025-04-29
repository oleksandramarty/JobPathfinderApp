import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericFormRendererComponent } from './generic-form-renderer.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputFormBuilder, InputFormGridBuilder, InputFormItemBuilder } from '@amarty/models';
import { TranslationPipe } from '@amarty/pipes';
import { Component } from '@angular/core';

// Мок GenericInputComponent, чтобы не поднимать реальные вложенные компоненты
@Component({
  selector: 'app-generic-input',
  standalone: true,
  template: '<input />'
})
class MockGenericInputComponent {}

describe('GenericFormRendererComponent', () => {
  let component: GenericFormRendererComponent;
  let fixture: ComponentFixture<GenericFormRendererComponent>;

  const onChangeSpy = jasmine.createSpy('onChange');
  const resetSpy = jasmine.createSpy('reset');
  const submitSpy = jasmine.createSpy('submit');
  const cancelSpy = jasmine.createSpy('cancel');

  const inputForm = new InputFormBuilder()
    .addGrid(
      new InputFormGridBuilder()
        .withTitle('Test Grid')
        .withGridCount(2)
        .addItem(
          new InputFormItemBuilder('name').withLabel('Name').withPlaceholder('Enter your name')
        )
    )
    .withResetButton({ showButton: true, buttonText: 'Reset', onClick: resetSpy })
    .withSubmitButton({ showButton: true, buttonText: 'Submit', onClick: submitSpy })
    .withCancelButton({ showButton: true, buttonText: 'Cancel', onClick: cancelSpy })
    .setClassName('test-form')
    .onFormChange(onChangeSpy)
    .build();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GenericFormRendererComponent,
        ReactiveFormsModule,
        TranslationPipe,
        MockGenericInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFormRendererComponent);
    component = fixture.componentInstance;
    component.renderForm = inputForm;
    component.showButtons = true;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the form element', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should apply the className to form', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form.classList.contains('test-form')).toBeTruthy();
  });

  it('should render the grid title', () => {
    const title = fixture.nativeElement.querySelector('.grid-2fr');
    expect(title).toBeTruthy();
  });

  it('should render app-generic-input for each inputItem', () => {
    const inputs = fixture.nativeElement.querySelectorAll('app-generic-input');
    expect(inputs.length).toBe(1);
  });

  it('should render reset button and trigger reset', () => {
    const button = fixture.nativeElement.querySelector('.button__link');
    expect(button.textContent.trim()).toBe('Reset');
    button.click();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should render submit button and trigger submit', () => {
    const submitButton = fixture.nativeElement.querySelector('.button__filled__submit');
    expect(submitButton.textContent.trim()).toBe('Submit');
    submitButton.click();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should render cancel button and trigger cancel', () => {
    const cancelButton = fixture.nativeElement.querySelector('.button:not(.button__link):not(.button__filled__submit)');
    expect(cancelButton.textContent.trim()).toBe('Cancel');
    cancelButton.click();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should call onChange when form value changes', () => {
    const control = component.renderForm?.inputFormGroup?.get('name');
    control?.setValue('New Value');
    expect(onChangeSpy).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'New Value' }));
  });

  it('should not render form if gridItems is empty', () => {
    component.renderForm = {
      ...inputForm,
      gridItems: []
    };
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeFalsy();
  });

  it('should not render input if inputItem.hidden = true', () => {
    const hiddenForm = new InputFormBuilder()
      .addGrid(
        new InputFormGridBuilder()
          .withGridCount(1)
          .addItem(new InputFormItemBuilder('secret').withHidden(true))
      )
      .build();

    component.renderForm = hiddenForm;
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('app-generic-input');
    expect(inputs.length).toBe(0);
  });
});
