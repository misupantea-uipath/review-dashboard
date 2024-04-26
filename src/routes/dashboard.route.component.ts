import { Component, signal } from '@angular/core';
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
    <app-navigation
      (onFiltersToggle)="areFiltersVisible.set(!areFiltersVisible())"
    />
    @if (areFiltersVisible()) {
      <div class="filters">
        <app-filters />
      </div>
    }
    <main>
      <app-pull-requests />
    </main>
  `,
  styles: [
    `
      .filters {
        position: fixed;
        left: 0;
        right: 0;
        top: var(--mat-toolbar-standard-height);

        z-index: 1;
      }

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

  areFiltersVisible = signal(false);
}
