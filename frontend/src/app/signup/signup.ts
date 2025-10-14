import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <span class="bold mt-3 mb-3" style="font-size: 2rem;">Créer un compte</span>

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

        <mat-form-field>
          <mat-label>Nom</mat-label>
          <input type="text" matInput formControlName="lastname" placeholder="Ex. Dupont" />
          @if (form.get('lastname')?.hasError('required')) {
          <mat-error>Le nom est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Prénom</mat-label>
          <input type="text" matInput formControlName="firstname" placeholder="Ex. Jean" />
          @if (form.get('firstname')?.hasError('required')) {
          <mat-error>Le prénom est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Numéro de téléphone</mat-label>
          <input
            type="text"
            matInput
            formControlName="phoneNumber"
            placeholder="Ex. 0477 08 09 44"
          />
          @if (form.get('phoneNumber')?.hasError('required')) {
          <mat-error>Le numéro de téléphone est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-radio-group formControlName="userStatus" color="primary">
          <mat-radio-button value="particulier">Particulier</mat-radio-button>
          <mat-radio-button disabled="true" value="agentImmobilier"
            >Agent immobilier</mat-radio-button
          >
          <mat-radio-button disabled="true" value="locataire">Locataire</mat-radio-button>
          <mat-radio-button disabled="true" value="syndicat">Syndicat</mat-radio-button>
        </mat-radio-group>

        <button [disabled]="form.invalid" matButton="filled" color="primary">
          Créer le compte
        </button>
      </form>
    </div>
  `,
})
export class SignupComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    userStatus: 'particulier',
  });

  hidePassword = signal(true);

  onSubmit() {
    // La soumission du formulaire est gérée ici
  }
}
