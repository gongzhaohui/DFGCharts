import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbAlertModule, NbInputModule, NbButtonModule, NbCheckboxModule } from '@nebular/theme';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken } from '@nebular/auth';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    NgxAuthRoutingModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'userName',
          token: {
            class: NbAuthJWTToken,
            key: 'token',
          },
          baseEndpoint: 'http://localhost:4000',
          login: {
            endpoint: 'auth/login',
            method: 'post',
          },
          logout: {
            endpoint: 'auth/logout',
            method: 'post',
          },
          requestPass: {
            endpoint: 'auth/request-pass',
            method: 'post',
          },
          resetPass: {
            endpoint: 'auth/reset-pass',
            method: 'post',
          },
        }),
      ],
      forms: {
        login: {
          redirectDelay: 500, // delay before redirect after a successful login, while success message is shown to the user
          strategy: 'fullName', // strategy id key.
          rememberMe: true, // whether to show or not the `rememberMe` checkbox
          showMessages: {
            // show/not show success/error messages
            success: true,
            error: true,
          },

          // socialLinks: socialLinks, // social links at the bottom of a page
        },
        register: {
          redirectDelay: 500,
          strategy: 'userName',
          showMessages: {
            success: true,
            error: true,
          },
          terms: true,
          // socialLinks: socialLinks,
        },
        requestPassword: {
          redirectDelay: 500,
          strategy: 'userName',
          showMessages: {
            success: true,
            error: true,
          },
          // socialLinks: socialLinks,
        },
        resetPassword: {
          redirectDelay: 500,
          strategy: 'userName',
          showMessages: {
            success: true,
            error: true,
          },
          // socialLinks: socialLinks,
        },
        logout: {
          redirectDelay: 500,
          strategy: 'userName',
        },
        validation: {
          userName: {
            required: true,
            minLength: 4,
            maxLength: 50,
          },
          password: {
            required: true,
            minLength: 4,
            maxLength: 50,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },
      },
    }),
  ],
})
export class AuthModule {}
