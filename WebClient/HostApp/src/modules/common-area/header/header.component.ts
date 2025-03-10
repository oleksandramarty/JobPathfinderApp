import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, of } from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/shared/components'
import { generateRandomId } from '@amarty/utils'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class HeaderComponent extends BaseUnsubscribeComponent {
  userAvatar = 'assets/images/avatar.png';

  constructor(
    protected readonly snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get isAuthorized$(): Observable<boolean> {
    return of(false);
  }

  public goto(url: string | undefined): void {
    this.router.navigate([`/${url ?? ''}`]);
  }

  public logout() {
    console.log('logout');
  }
}
