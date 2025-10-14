import { Component, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [
    MatDividerModule,
    MatButtonModule,
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
      <span class="bold mt-3 mb-3" style="font-size: 2rem;">Mes informations</span>

      <div class="card columns w-100" style="padding: 3rem;">
        <div class="row" style="justify-content: space-between;">
          <div class="column">
            <span style="font-size: 1.2rem;">Informations sur l'utilisateur:</span>
            <form [formGroup]="form">
              <label for="">Nom: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Nom</mat-label>
                <input type="text" matInput formControlName="lastname" placeholder="Ex. Dupont" />
                @if (form.get('lastname')?.hasError('required')) {
                <mat-error>Le nom est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ user.lastname }}</span>
              }

              <br />

              <label for="">Prénom: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Prénom</mat-label>
                <input type="text" matInput formControlName="firstname" placeholder="Ex. Jean" />
                @if (form.get('firstname')?.hasError('required')) {
                <mat-error>Le prénom est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ user.firstname }}</span>
              }

              <br />

              <label for="">Email: </label>
              <span>{{ user.email }}</span>

              <br />

              <label for="">Numéro de téléphone: </label>
              @if (editMode()) {
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
              } @else {
              <span>{{ user.phoneNumber }}</span>
              }

              <br />

              <label for="">Statut: </label>
              <span>{{ user.userStatus }}</span>
            </form>
          </div>
          @if (editMode()) {
          <div class="row gap-1">
            <button
              (click)="submitEdit()"
              [disabled]="form.invalid"
              matButton="filled"
              color="primary"
            >
              Valider</button
            ><button (click)="editMode.set(false)" matButton="outlined" color="primary">
              Annuler
            </button>
          </div>
          } @else {
          <button (click)="editMode.set(true)" matButton="filled" color="primary">Modifier</button>
          }
        </div>

        <mat-divider style="margin: 3rem 0rem;"></mat-divider>

        <div class="row" style="justify-content: space-between;">
          <form [formGroup]="passwordForm">
            <mat-form-field>
              <mat-label>Mot de passe actuel</mat-label>
              <input
                [type]="hidePassword() ? 'password' : 'text'"
                matInput
                formControlName="oldPassword"
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
              @if (passwordForm.get('oldPassword')?.hasError('required')) {
              <mat-error>Le mot de passe est <strong>obligatoire</strong></mat-error>
              }
            </mat-form-field>

            <br />

            <mat-form-field>
              <mat-label>Nouveau mot de passe</mat-label>
              <input
                [type]="hidePassword() ? 'password' : 'text'"
                matInput
                formControlName="newPassword"
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
              @if (passwordForm.get('newPassword')?.hasError('required')) {
              <mat-error>Le mot de passe est <strong>obligatoire</strong></mat-error>
              } @if (passwordForm.get('newPassword')?.hasError('samePassword')) {
              <mat-error>Les 2 mots de passe doivent être <strong>identique</strong></mat-error>
              }
            </mat-form-field>
          </form>

          <div class="column gap-1">
            <button
              (click)="submitPassword()"
              [disabled]="passwordForm.invalid"
              matButton="filled"
              color="warn"
            >
              Modifier mot de passe
            </button>

            <a class="center" href="">Mot de passe oublié ?</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  user = {
    lastname: 'Dupont',
    firstname: 'Jean',
    email: 'dupont@gmail.com',
    phoneNumber: '0477 89 07 21',
    userStatus: 'particulier',
  };

  editMode = signal(false);

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    lastname: [this.user.lastname, Validators.required],
    firstname: [this.user.firstname, Validators.required],
    phoneNumber: [this.user.phoneNumber, Validators.required],
  });

  submitEdit() {}

  hidePassword = signal(true);

  samePasswordValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const oldPassword = group.get('oldPassword')?.value;
      const newPassword = group.get('newPassword')?.value;
      if (!oldPassword || !newPassword) return null;
      return oldPassword === newPassword ? { samePassword: true } : null;
    };
  }

  passwordForm = this.formBuilder.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    },
    {
      validators: this.samePasswordValidator(),
    }
  );

  ngOnInit() {
    console.log(this.passwordForm);
  }

  submitPassword() {}
}
