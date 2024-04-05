import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private readonly _repositories = signal<string[]>([]);

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

  setRepositories(repositories: string[]) {
    this._repositories.set(repositories);
  }

  addRepository(repository: string) {
    if (this._repositories().includes(repository)) return;
    this._repositories.set([...this._repositories(), repository]);
  }

  removeRepository(repository: string) {
    if (!this._repositories().includes(repository)) return;
    this._repositories.set(
      this._repositories().filter((repo) => repo !== repository),
    );
  }

  private _hydratePersistedRepositories() {
    const persistedRepositories = window.localStorage.getItem(
      'filters:repositories',
    );

    if (persistedRepositories) {
      this._repositories.set(JSON.parse(persistedRepositories));
    }
  }
}
