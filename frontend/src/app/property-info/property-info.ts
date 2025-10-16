import { Component, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
  selector: 'app-property-info',
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
    MatSelectModule,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <div class="column w-100 gap-2">
        <div class="row gap-1" style="align-self: flex-end;">
          @if (!editMode()) {
          <button (click)="editMode.set(true)" matButton="filled" color="primary">Modifier</button>
          <button matButton="filled" color="warn">Supprimer</button>
          } @else {
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
          }
        </div>

        <div class="row gap-2">
          <img
            [src]="property.image"
            [alt]="property.label"
            class="card"
            style="width: 15rem; height: 15rem;"
          />

          <div class="column card w-100" style="padding: 2rem;">
            <span style="font-size: 1.2rem;">Informations sur le bien:</span>

            <form [formGroup]="form">
              <label for="">Label: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Label</mat-label>
                <input type="text" matInput formControlName="label" placeholder="Ex. La mise" />
                @if (form.get('label')?.hasError('required')) {
                <mat-error>Le label est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ property.label }}</span>
              }

              <br />

              <label for="">Type de propriété: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Type de propriété</mat-label>
                <mat-select formControlName="type">
                  @for (propertyType of propertyTypes; track propertyType) {
                  <mat-option [value]="propertyType">{{ propertyType }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              } @else {
              <span>{{ property.type }}</span>
              }

              <br />

              <label for="">Statut: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Statut</mat-label>
                <mat-select formControlName="status">
                  @for (statusType of statusTypes; track statusType) {
                  <mat-option [value]="statusType">{{ statusType }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              } @else {
              <span>{{ property.status }}</span>
              }

              <br />

              <label for="">Rue: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Rue</mat-label>
                <input
                  type="text"
                  matInput
                  formControlName="street"
                  placeholder="Ex. rue des gangsters 27"
                />
                @if (form.get('street')?.hasError('required')) {
                <mat-error>La rue est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ property.street }}</span>
              }

              <br />

              <label for="">Ville: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Ville</mat-label>
                <input type="text" matInput formControlName="city" placeholder="Ex. Berlin" />
                @if (form.get('city')?.hasError('required')) {
                <mat-error>La ville est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ property.city }}</span>
              }

              <br />

              <label for="">Pays: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Pays</mat-label>
                <input type="text" matInput formControlName="country" placeholder="Ex. Allemagne" />
                @if (form.get('country')?.hasError('required')) {
                <mat-error>Le pays est <strong>obligatoire</strong></mat-error>
                }
              </mat-form-field>
              } @else {
              <span>{{ property.country }}</span>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PropertyInfoComponent {
  property = {
    id: 1,
    image: '/unnamed.jpg',
    label: 'La madre',
    type: 'house',
    status: 'rented',
    street: 'rue des putes 69',
    city: 'Couillet',
    country: 'Belgikistant',
  };

  editMode = signal(false);

  propertyTypes = ['house', 'apartment', 'building'];
  statusTypes = ['rented', 'free', 'main residence'];

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    label: [this.property.label, Validators.required],
    type: [this.property.type, Validators.required],
    status: [this.property.status, Validators.required],
    street: [this.property.street, Validators.required],
    city: [this.property.city, Validators.required],
    country: [this.property.country, Validators.required],
  });

  submitEdit() {}
}
