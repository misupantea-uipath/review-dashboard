import { CanActivateFn, Router, Routes } from '@angular/router';
import { DashboardRouteComponent } from '../routes/dashboard.route.component';
import { LoginRouteComponent } from '../routes/login.route.component';
import { inject } from '@angular/core';

const canActivate: CanActivateFn = () => {
  const router = inject(Router);
  const hasToken = !!localStorage.getItem('pat');
  return hasToken ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardRouteComponent,
    canActivate: [canActivate],
  },
  { path: 'login', pathMatch: 'full', component: LoginRouteComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'prefix' },
];
