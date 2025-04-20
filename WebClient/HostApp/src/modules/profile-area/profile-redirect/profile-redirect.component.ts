import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BaseUnsubscribeComponent} from '@amarty/common';
import {Store} from '@ngrx/store';
import {selectUser} from '@amarty/store';
import {takeUntil, tap} from 'rxjs';

@Component({
  selector: 'app-profile-redirect',
  imports: [
    CommonModule,
    RouterModule
  ],
  standalone: true,
  template: ''
})
export class ProfileRedirectComponent extends BaseUnsubscribeComponent {
  constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {
    super();
  }

  override ngOnInit(): void {
    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((user) => {
            if (!!user) {
              this.router.navigate(['/profile', user.login]);
            } else {
              this.router.navigate(['/auth/sign-in']);
            }
          }
        )
      ).subscribe();

    super.ngOnInit();
  }
}
