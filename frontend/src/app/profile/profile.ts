import { Component, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormGroup, FormsModule } from '@angular/forms';
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <span class="bold mt-3 mb-3" style="font-size: 2rem;">Mes informations</span>

      <div class="card columns w-100" style="padding: 3rem;">
        <div class="row" style="justify-content: space-between;">
          @if (loading()) {
          <mat-spinner></mat-spinner>
          } @else {
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
              <span>{{ user?.lastname }}</span>
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
              <span>{{ user?.firstname }}</span>
              }

              <br />

              <label for="">Email: </label>
              <span>{{ user?.email }}</span>

              <br />

              <label for="">Numéro de téléphone: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Numéro de téléphone</mat-label>
                <input
                  type="text"
                  matInput
                  formControlName="phone"
                  placeholder="Ex. 0477 08 09 44"
                />
                @if (form.get('phone')?.hasError('required')) {
                <mat-error>Le numéro de téléphone est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ user?.phone }}</span>
              }

              <br />

              <label for="">Type: </label>
              <span>{{ user?.userType }}</span>
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
          } }
        </div>

        <mat-divider style="margin: 3rem 0rem;"></mat-divider>

        <div class="row" style="justify-content: space-between;">
          @if (passwordLoading()) {
          <mat-spinner></mat-spinner>
          } @else {
          <form [formGroup]="passwordForm">
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
              }
            </mat-form-field>

            <br />

            <mat-form-field>
              <mat-label>Valider nouveau mot de passe</mat-label>
              <input
                [type]="hidePassword() ? 'password' : 'text'"
                matInput
                formControlName="validateNewPassword"
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
              @if (passwordForm.get('validateNewPassword')?.hasError('required')) {
              <mat-error>Le mot de passe est <strong>obligatoire</strong></mat-error>
              } @if (!similarPasswords()) {
              <p style="color: red;">Les 2 mots de passe doivent être <strong>identique</strong></p>
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
          }
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  constructor(private http: HttpClient) {}

  private snackBar = inject(MatSnackBar);

  user: User | null = null;

  private formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    lastname: [''],
    firstname: [''],
    phone: [''],
  });

  loading = signal(true);

  private userService = inject(UserService);

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (data: User) => {
        this.user = data;

        this.form = this.formBuilder.group({
          lastname: [this.user.lastname, Validators.required],
          firstname: [this.user.firstname, Validators.required],
          phone: [this.user.phone, Validators.required],
        });

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Impossible de charger l’utilisateur', err);

        this.loading.set(false);
      },
    });
  }

  editMode = signal(false);

  submitEdit() {
    this.loading.set(true);

    this.http.post<User>(`${API_URL}/user`, this.form.value).subscribe({
      next: (res) => {
        this.form.patchValue({
          lastname: res.lastname,
          firstname: res.firstname,
          phone: res.phone,
        });

        this.loading.set(false);

        this.snackBar.open('Utilisateur mis à jour avec succès!', 'Fermer');
      },
      error: (error) => {
        this.loading.set(false);

        this.snackBar.open("Erreur lors de la mis à jour de l'utilisateur!", 'Fermer');
      },
    });
  }

  hidePassword = signal(true);

  similarPasswords = signal(true);

  passwordLoading = signal(false);

  passwordForm = this.formBuilder.group({
    newPassword: ['', Validators.required],
    validateNewPassword: ['', Validators.required],
  });

  submitPassword() {
    if (
      this.passwordForm.get('newPassword')?.value !==
      this.passwordForm.get('validateNewPassword')?.value
    ) {
      this.similarPasswords.set(false);
      return;
    }

    this.similarPasswords.set(true);
    this.passwordLoading.set(true);

    this.http.post(`${API_URL}/user/password`, this.passwordForm.value).subscribe({
      next: () => {
        this.passwordForm.reset();

        this.passwordLoading.set(false);

        this.snackBar.open('Mot de passe mis à jour avec succès!', 'Fermer');
      },
      error: () => {
        this.passwordLoading.set(false);

        this.snackBar.open('Erreur lors de la mis à jour du mot de passe!', 'Fermer');
      },
    });
  }
}
