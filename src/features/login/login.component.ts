import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';

const GITHUB_PAT_DOCS_URL =
  'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,

    //

    CommonModule,
  ],
  template: `
    <div class="wrapper">
      <h1 class="mat-headline-3 title">
        GitHub on <b class="accent">Steriods</b>
      </h1>
      <form
        class="form"
        [formGroup]="formGroup"
        (submit)="handleSubmit($event)"
      >
        <mat-form-field color="accent" class="pat-field">
          <mat-label>Personal Access Token</mat-label>
          <input
            name="pat"
            matInput
            autofocus
            type="password"
            formControlName="pat"
          />
          <mat-icon matSuffix>token</mat-icon>
          <mat-hint>
            <a class="hint-link" [href]="docsUrl" target="_blank"
              >What is a PAT?</a
            >
          </mat-hint>
        </mat-form-field>

        <button
          mat-raised-button
          color="accent"
          type="submit"
          class="submit-button"
          [disabled]="!formGroup.get('pat')?.value"
        >
          Login
        </button>
      </form>
    </div>
  `,

  styles: [
    `
      .wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .title {
        margin-bottom: 3rem;
      }

      .form {
        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 2rem;
      }

      .submit-button {
        transition-property: opacity;
        transition-duration: var(--transition-duration);
        transition-timing-function: var(--transition-function);
      }

      .submit-button[disabled] {
        opacity: 0;
      }
    `,
  ],
})
export class LoginComponent {
  formGroup = this._fb.group({ pat: [''] });

  docsUrl = GITHUB_PAT_DOCS_URL;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
  ) {}

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (this.formGroup.value.pat) {
      localStorage.setItem('pat', this.formGroup.value.pat);
      this._router.navigate(['/dashboard']);
    }
  }
}
