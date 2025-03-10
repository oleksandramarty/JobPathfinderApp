import { Component } from '@angular/core';
import { generateRandomId } from '@amarty/utils'

@Component({
  selector: 'app-auth-area',
  templateUrl: './auth-area.component.html',
  styleUrl: './auth-area.component.scss',
  standalone: false,
  host: { 'data-id': generateRandomId(12) }
})
export class AuthAreaComponent {
}
