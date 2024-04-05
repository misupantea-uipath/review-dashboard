import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { FiltersService } from '../../services/filters/filters.service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-filters',
  standalone: true,
  template: `
    <div class="filters">
      <mat-form-field class="repositories" color="accent">
        <mat-label>Repositories</mat-label>
        <mat-chip-grid #chipGrid aria-label="Search repository">
          @for (repo of repositories(); track repo) {
            <mat-chip-row (removed)="removeRepository(repo)">
              {{ repo }}
              <button matChipRemove [attr.aria-label]="'remove ' + repo">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
          }
          <input
            placeholder="Include repository..."
            matChipInputAddOnBlur
            [matChipInputFor]="chipGrid"
            [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
            (matChipInputTokenEnd)="addRepository($event)"
          />
        </mat-chip-grid>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .filters {
        display: flex;
      }
      .repositories {
        flex: 1;
      }
    `,
  ],
  imports: [MatIconModule, MatButtonModule, MatChipsModule, MatFormFieldModule],
})
export class FiltersComponent {
  private readonly _filtersService = inject(FiltersService);
  readonly separatorKeysCodes = [ENTER, COMMA];
  repositories = this._filtersService.getRepositories();

  removeRepository = this._filtersService.removeRepository.bind(
    this._filtersService,
  );

  constructor() {}

  addRepository(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (!value) return;

    this._filtersService.addRepository(value);

    event.chipInput.clear();
  }
}
