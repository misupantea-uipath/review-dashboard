import { Component } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PullRequestsComponent } from '../components/pull-requests/pull-requests.component';
import { GithubService } from '../services/github/github.service';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-route-dashboard',
  standalone: true,
  imports: [NavigationComponent, PullRequestsComponent, FiltersComponent],
  providers: [GithubService],
  template: `
    <app-navigation />
    <div class="filters">
      <app-filters />
    </div>
    <main>
      <app-pull-requests />
    </main>
  `,
  styles: [
    `
      .filters {
        margin-top: var(--mat-toolbar-standard-height);
        position: sticky;
        top: var(--mat-toolbar-standard-height);

        z-index: 1;
      }

      main {
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
