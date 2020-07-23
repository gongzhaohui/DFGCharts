import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dfg-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
}