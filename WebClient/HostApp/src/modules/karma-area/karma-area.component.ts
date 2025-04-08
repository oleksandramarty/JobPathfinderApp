import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { TranslationPipe } from '@amarty/pipes';

@Component({
  selector: 'app-karma-area',
  imports: [
    CommonModule,
    TranslationPipe
  ],
  standalone: true,
  templateUrl: './karma-area.component.html',
  styleUrl: './karma-area.component.scss'
})
export class KarmaAreaComponent extends BaseUnsubscribeComponent {
  constructor() {
    super();
  }
} 