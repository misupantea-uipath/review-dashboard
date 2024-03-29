import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { graphqlProvider } from './graphql.provider';
import { MatDividerModule } from '@angular/material/divider';
import { GithubService } from '../services/github/github.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDividerModule],
  providers: [graphqlProvider, GithubService],
  template: '<router-outlet />',
})
export class AppComponent {
  title = 'github-on-steroids';
}
