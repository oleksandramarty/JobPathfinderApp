import { Component } from '@angular/core';
import { generateRandomId } from '@amarty/utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  host: { 'data-id': generateRandomId(12) }
})
export class AppComponent {
  constructor(
  ) {
  }
}
