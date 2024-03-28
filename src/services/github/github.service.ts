import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Injectable } from '@angular/core';
import { ApolloError } from '@apollo/client/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { EmptyObject } from 'apollo-angular/types';
import {
  ReplaySubject,
  catchError,
  distinctUntilChanged,
  map,
  throwError,
} from 'rxjs';

export interface IGitHubRateLimit {
  remaining: number;
  limit: number;
}

type WithRateLimitsQuery<T = {}> = T & { rateLimit: IGitHubRateLimit };
type SearchQuery<T> = WithRateLimitsQuery<{ search: T }>;
type ViewerQuery<T> = WithRateLimitsQuery<{ viewer: T }>;

export type IGitHubUser = {
  avatarUrl: string;
  name: string;
  organizations: {
    nodes: IGitHubUserOrg[];
  };
};

export interface IGitHubUserOrg {
  avatarUrl: string;
  description: string;
  id: string;
  login: string;
  url: string;
}

export interface IGitHubSearchResults<T> {
  issueCount: number;
  nodes: T[];
}

export interface IGitHubPullRequest {
  repository: {
    nameWithOwner: string;
    name: string;
    owner: {
      login: string;
      avatarUrl: string;
    };
  };

  title: string;
  id: string;
  url: string;
  number: number;
  state: string;
  viewerSubscription: string;
  isReadByViewer: boolean;
  updatedAt: string;
  createdAt: string;
  author: {
    login: string;
    url: string;
    avatarUrl: string;
  };
  labels: {
    totalCount: number;
    nodes: {
      color: string;
      name: string;
    }[];
  };
  bodyHTML: string;
  totalCommentsCount: number;
  reviewDecision: string;
}

const rateLimitQuery = gql`
  query {
    rateLimit {
      remaining
      limit
    }
  }
`;

const currentUserQuery = gql`
  query {
    rateLimit {
      remaining
      limit
    }
    viewer {
      avatarUrl
      login
      name
      bio
      company
      email
      location
      websiteUrl
      organizations(first: 10) {
        nodes {
          avatarUrl
          description
          id
          login
          url
        }
      }
    }
  }
`;

const getIssuesForRepoQuery = gql`
  query ($query: String!) {
    rateLimit {
      remaining
      limit
    }
    search(query: $query, type: ISSUE, first: 50) {
      issueCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ... on PullRequest {
          title
          repository {
            nameWithOwner
            name
            owner {
              login
              avatarUrl
            }
          }
          url
          id
          number
          state
          viewerSubscription
          isReadByViewer
          updatedAt
          createdAt
          bodyHTML
          author {
            login
            url
            avatarUrl
          }
          labels(first: 10) {
            totalCount
            nodes {
              color
              name
            }
          }
          totalCommentsCount
          reviewDecision
        }
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class GithubService {
  private _pullRequestsQuery?: QueryRef<
    SearchQuery<IGitHubSearchResults<IGitHubPullRequest>>,
    EmptyObject
  >;

  constructor(private _apolloClient: Apollo) {
    if (!localStorage.getItem('pat')) {
      const pat = this._promptPat();
      pat && localStorage.setItem('pat', pat);

      window.location.href = window.location.href;
    }
  }

  getRateLimit$() {
    return this._apolloClient
      .watchQuery<WithRateLimitsQuery>({
        query: rateLimitQuery,
        fetchPolicy: 'cache-only',
      })
      .valueChanges.pipe(
        catchError(this._handleError),
        map((result) => result.data?.rateLimit || {}),
      );
  }

  getCurrentUser$() {
    return this._apolloClient
      .watchQuery<ViewerQuery<IGitHubUser>>({
        query: currentUserQuery,
      })
      .valueChanges.pipe(
        catchError(this._handleError),
        map((result) => result.data?.viewer),
      );
  }

  getPullRequests$() {
    return this._getPullRequestsQuery().valueChanges.pipe(
      catchError(this._handleError),
      map((result) => result.data?.search.nodes || []),
      distinctUntilChanged(),
      map((pullRequests) => {
        const sortedPullRequests = [...pullRequests];
        sortedPullRequests.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        return sortedPullRequests;
      }),
    );
  }

  getIsLoadingPullRequests$() {
    return this._getPullRequestsQuery().valueChanges.pipe(
      map((result) => result.loading),
    );
  }

  refreshPullRequests() {
    this._getPullRequestsQuery().refetch();
  }

  private _getPullRequestsQuery() {
    const pullRequestsQuery =
      this._pullRequestsQuery ||
      this._apolloClient.watchQuery<
        SearchQuery<IGitHubSearchResults<IGitHubPullRequest>>
      >({
        query: getIssuesForRepoQuery,
        notifyOnNetworkStatusChange: true,
        pollInterval: 1000 * 60,
        variables: {
          // query: `org:UiPath is:pr is:open review-requested:@me`,
          query: `repo:UiPath/DU-App is:pr is:open review-requested:@me`,
          // query: `repo:UiPath/apollo-design-system is:pr is:open review-requested:@me`,
          // query: `repo:UiPath/DU-App is:pr is:open author:@me`,
        },
      });

    if (!this._pullRequestsQuery) this._pullRequestsQuery = pullRequestsQuery;

    return pullRequestsQuery;
  }

  private _promptPat = (
    message = 'Please enter your GitHub Personal Access Token (PAT)',
  ) => {
    let pat: string | null = null;
    pat = prompt(message);
    return pat;
  };

  private _handleError(_error: ApolloError) {
    const graphQLErrors = _error.graphQLErrors;
    // TODO: Handle GraphQL errors for INSUFFICIENT_SCOPES

    const networkError = _error.networkError as HttpErrorResponse | null;

    if (networkError) {
      if (networkError.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', networkError.error);
      } else if (networkError.status === 401) {
        // When Unauthorized, remove PAT & reload.

        // TODO: proper login guard
        localStorage.removeItem('pat');
        window.location.href = window.location.href;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${networkError.status}, body was: `,
          networkError.error,
        );
      }
    }

    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
