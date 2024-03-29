import { Component } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PullRequestsComponent } from '../components/pull-requests/pull-requests.component';
import { GithubService } from '../services/github/github.service';

@Component({
  selector: 'app-route-dashboard',
  standalone: true,
  imports: [NavigationComponent, PullRequestsComponent],
  providers: [GithubService],
  template: `
    <app-navigation />
    <main>
      <app-pull-requests />
    </main>
  `,
  styles: [
    `
      main {
        margin-top: var(--mat-toolbar-standard-height);
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
    `,
  ],
})
export class DashboardRouteComponent {
  constructor() {}
}
