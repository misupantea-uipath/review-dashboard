import { Component, inject, input, output, signal } from '@angular/core';
import { GithubService } from '../../services/github/github.service';
import { CommonModule } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    MatCardModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],

  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  private readonly _githubService = inject(GithubService);

  readonly userData$ = this._githubService.getCurrentUser$();
  readonly rateLimit$ = this._githubService.getRateLimit$();
  readonly isLoadingPullRequests$ =
    this._githubService.getIsLoadingPullRequests$();

  readonly refreshPullRequests = this._githubService.refreshPullRequests.bind(
    this._githubService,
  );

  areFiltersVisible = input.required<boolean>();
  onFiltersToggle = output();
}
