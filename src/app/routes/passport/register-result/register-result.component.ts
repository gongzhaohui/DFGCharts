import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-register-result',
  templateUrl: './register-result.component.html',
})
export class UserRegisterResultComponent implements OnInit {
  params = { email: '' };
  email = '';
  constructor(private route: ActivatedRoute, public msg: NzMessageService) {}
  ngOnInit(): void {
    // console.log('route snapshot param:' + JSON.stringify(this.route.snapshot.queryParams));
    this.route.queryParams.subscribe((params) => {
      this.params.email = this.email = params.email;
      // console.log('route param:' + JSON.stringify(params));
    });

    // this.params.email = this.email = route.snapshot.queryParams.email || 'ng-alain@example.com';
  }
  openMailbox(): void {
    this.msg.success(`email:${this.email}`);
  }
}
