import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-connexion',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <span class="bold mt-3 mb-3" style="font-size: 2rem;">ImmoApp</span>

      <form class="column gap-1" [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Adresse email</mat-label>
          <input type="email" matInput formControlName="email" placeholder="Ex. pat@example.com" />
          @if (form.get('email')?.hasError('email') && !form.get('email')?.hasError('required')) {
          <mat-error>Entrez un adresse mail valide</mat-error>
          } @if (form.get('email')?.hasError('required')) {
          <mat-error>L'email est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Mot de passe</mat-label>
          <input
            [type]="hidePassword() ? 'password' : 'text'"
            matInput
            formControlName="password"
          />
          <button
            type="button"
            mat-icon-button
            matSuffix
            (click)="hidePassword.set(!hidePassword())"
            [attr.aria-label]="'Toggle password visibility'"
            [attr.aria-pressed]="!hidePassword()"
          >
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.get('password')?.hasError('required')) {
          <mat-error>Le mot de passe est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <button [disabled]="form.invalid" matButton="filled" color="primary">Se connecter</button>

        <a class="center" href="">Mot de passe oublié ?</a>
      </form>
    </div>
  `,
})
export class ConnexionComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  hidePassword = signal(true);

  onSubmit() {
    // La soumission du formulaire est gérée ici
  }
}
