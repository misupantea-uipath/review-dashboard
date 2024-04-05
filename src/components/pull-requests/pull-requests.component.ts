import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PRComponent } from './pr/pr.component';
import { GithubService } from '../../services/github/github.service';

@Component({
  selector: 'app-pull-requests',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    PRComponent,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pull-requests.component.html',
  styleUrl: './pull-requests.component.scss',
})
export class PullRequestsComponent {
  private readonly _githubService = inject(GithubService);

  readonly pullRequests$ = this._githubService.getPullRequests$();
  readonly isLoadingPullRequests$ =
    this._githubService.getIsLoadingPullRequests$();
}
