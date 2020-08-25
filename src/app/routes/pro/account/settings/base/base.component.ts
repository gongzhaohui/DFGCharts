import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
// import { FormGroup } from '@angular/forms';

interface ProAccountSettingsUser {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  profile: string;
  country: string;
  address: string;
  mobile: string;
  avatar: string;
  birthed: Date;
  gender: string;
  province: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
}

interface ProAccountSettingsCity {
  name: string;
  id: string;
}

@Component({
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private settingsService: SettingsService,
  ) {}
  avatar = '';
  userLoading = true;
  user: ProAccountSettingsUser;
  userId = 0;

  // #region geo

  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];
  // form:FormGroup;

  ngOnInit(): void {
    this.userId = this.settingsService.getData('user').id;
    // console.log('current user:' + userId);
    zip(this.http.get(`users/${this.userId}`), this.http.get('/geo/province')).subscribe(
      ([user, provinces]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
        this.userLoading = false;
        this.user = user;
        this.provinces = provinces;
        if (user.province == null) {
          this.user.province = this.provinces[0];
        }
        if (user.city == null) {
          this.user.city = { id: '', name: '' };
        }
        // else {
        //   this.user.province = user.province;
        //   this.user.city = user.city;
        // }

        this.user.province = this.provinces.find((item) => item.id === this.user.province.id);
        // console.log('user.province:' + this.user.province ? '1' : '2');

        this.choProvince(this.user.province, false);

        this.cdr.detectChanges();
      },
    );
  }

  choProvince(e, cleanCity: boolean = true): void {
    const pid = e.id;
    console.log('prov:' + JSON.stringify(e), `/geo/${pid}`);
    this.http.get(`/geo/${pid}`).subscribe((res) => {
      this.cities = res;

      if (cleanCity) {
        this.user.city.id = '';
      } else {
        this.user.city = this.cities.find((item) => item.id === this.user.city.id);
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save(data: ProAccountSettingsUser): boolean {
    console.log('submit data:' + JSON.stringify(data));
    this.http.patch(`users/${this.userId}`, data).subscribe((res) => {
      this.msg.success(JSON.stringify(res));
    });

    return true;
  }
}
