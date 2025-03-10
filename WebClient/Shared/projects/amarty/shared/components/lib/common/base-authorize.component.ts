import {BaseUnsubscribeComponent} from "./base-unsubscribe.compoinent";
import {Store} from "@ngrx/store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Directive} from '@angular/core';
import { AuthService } from '@amarty/services';
import {Observable} from 'rxjs';

@Directive()
export abstract class BaseAuthorizeComponent extends BaseUnsubscribeComponent {
    protected constructor(
        protected readonly authService: AuthService,
        protected readonly store: Store,
        protected readonly snackBar: MatSnackBar
    ) {
        super();
    }

    get isAuthorized$(): Observable<boolean> | undefined {
        return this.authService.isAuthorized$;
    }

    get isUser$(): Observable<boolean> | undefined {
        return this.authService.isUser$;
    }

    get isAdmin$(): Observable<boolean> | undefined {
        return this.authService.isAdmin$;
    }

    get isSuperAdmin$(): Observable<boolean> | undefined {
        return this.authService.isSuperAdmin$;
    }
}
