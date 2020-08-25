import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, JWTTokenModel } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    public http: _HttpClient,
    public msg: NzMessageService,
    private settingsService: SettingsService,
    //  private socialService: SocialService,
    // private authService:authservi
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      // firstName:[null, [Validators.required, Validators.minLength(4)]],
      // lastName:[null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEqual]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      // gender: [null, [Validators.required]],
      // birthed: [null, [Validators.nullValidator,Validators.pattern(/^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/)]],
    });
  }

  // #region fields

  get email(): AbstractControl {
    return this.form.controls.email;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get confirm(): AbstractControl {
    return this.form.controls.confirm;
  }
  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }
  // get captcha(): AbstractControl {
  //   return this.form.controls.captcha;
  // }
  form: FormGroup;
  error = '';
  type = 0;
  visible = false;
  status = 'poor';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
  };

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  static checkPassword(control: FormControl): void {
    if (!control) {
      return null;
    }
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'poor';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEqual(control: FormControl): { equal: boolean } | null {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get('password').value) {
      return { equal: true };
    }
    return null;
  }

  // getCaptcha(): void {
  //   if (this.mobile.invalid) {
  //     this.mobile.markAsDirty({ onlySelf: true });
  //     this.mobile.updateValueAndValidity({ onlySelf: true });
  //     return;
  //   }
  //   this.count = 59;
  //   this.interval$ = setInterval(() => {
  //     this.count -= 1;
  //     if (this.count <= 0) {
  //       clearInterval(this.interval$);
  //     }
  //   }, 1000);
  // }

  // #endregion

  submit(): void {
    this.error = '';
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    // console.log('form data:' + JSON.stringify(data));
    // ?_allow_anonymous=true
    this.http.post('auth/register', data).subscribe((res) => {
      // console.log('register res:' + JSON.stringify(res));
      if (res.msg && res.msg !== 'ok') {
        this.error = res.msg;
        return;
      }
      // 清空路由复用信息
      this.reuseTabService.clear();
      // 设置用户Token信息
      this.tokenService.set(res);
      const user = this.tokenService.get(JWTTokenModel).payload.user;
      // console.log('payload:'+user);
      this.settingsService.setUser(user);
      // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
      this.startupSrv.load().then(() => {
        // console.log('data.mail:'+data.email);
        this.router.navigate(['/passport/register-result'], {
          queryParams: { email: data.email },
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
