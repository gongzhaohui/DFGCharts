import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonAuthModule, JWTInterceptor } from '@delon/auth';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [FormsModule, RouterModule, DelonAuthModule],
  providers: [
    // 指定认证风格对应的HTTP拦截器
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  ],
})
export class AuthModule {}
