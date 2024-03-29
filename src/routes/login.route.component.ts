import { Component } from '@angular/core';

import { LoginComponent } from '../features/login/login.component';

@Component({
  selector: 'app-route-login',
  standalone: true,
  imports: [LoginComponent],
  template: `<div><app-login /></div>`,
})
export class LoginRouteComponent {
  constructor() {}
}
