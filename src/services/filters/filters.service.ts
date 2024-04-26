import { Injectable, effect, signal } from '@angular/core';

interface RepositoryFilter {
  name: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private readonly _repositories = signal<RepositoryFilter[]>([]);

  constructor() {
    this._hydratePersistedRepositories();

    effect(() => {
      window.localStorage.setItem(
        'filters:repositories',
        JSON.stringify(this._repositories()),
      );
    });
  }

  getRepositories() {
    return this._repositories.asReadonly();
  }

  addRepository(repositoryName: string) {
    if (this._includesRepository(repositoryName)) return;

    this._repositories.set([
      ...this._repositories(),
      { name: repositoryName, isActive: true },
    ]);
  }

  toggleRepository({ name }: RepositoryFilter) {
    if (!this._includesRepository(name)) return;

    this._repositories.set(
      this._repositories().map((repo) =>
        name === repo.name ? { ...repo, isActive: !repo.isActive } : repo,
      ),
    );
  }

  removeRepository({ name }: RepositoryFilter) {
    if (!this._includesRepository(name)) return;

    this._repositories.set(
      this._repositories().filter((repo) => name !== repo.name),
    );
  }

  private _hydratePersistedRepositories() {
    const persistedRepositories = window.localStorage.getItem(
      'filters:repositories',
    );

    if (persistedRepositories) {
      const rawPersistedRepos = JSON.parse(persistedRepositories);
      const hydratedPersistedRepos = rawPersistedRepos.map(
        (rawRepo: unknown) => {
          if (typeof rawRepo === 'string') {
            return { name: rawRepo, isActive: true };
          } else return rawRepo;
        },
      );

      this._repositories.set(hydratedPersistedRepos);
    }
  }

  private _includesRepository(repositoryName: string) {
    return this._repositories()
      .map(({ name }) => name)
      .includes(repositoryName);
  }
}
