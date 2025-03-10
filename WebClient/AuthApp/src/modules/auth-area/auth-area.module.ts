import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthAreaComponent } from './auth-area/auth-area.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthSignInComponent } from './auth-sign-in/auth-sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { GenericInputComponent } from '@amarty/shared/components';
import {AuthForgotComponent} from './auth-forgot/auth-forgot.component';
import {environment} from '../../utils/environments/environment';
import { API_BASE_URL_AuthGateway, UserApiClient } from '@amarty/api';

const routes: Routes = [
    {
        path: '',
        component: AuthAreaComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
            { path: 'sign-in', component: AuthSignInComponent },
            { path: 'sign-up', component: AuthSignUpComponent },
            { path: 'forgot', component: AuthForgotComponent },
        ]
    }
];

@NgModule({
    declarations: [
        AuthAreaComponent,
        AuthSignInComponent,
        AuthSignUpComponent,
        AuthForgotComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,

        GenericInputComponent
    ],
  providers: [
    { provide: API_BASE_URL_AuthGateway, useValue: environment.authGatewayApiUrl },
    UserApiClient
  ],
    exports: [
        RouterModule
    ]
})
export class AuthAreaModule {
}
