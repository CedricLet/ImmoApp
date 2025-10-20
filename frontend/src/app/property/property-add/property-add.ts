import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ContextRole, PropertyStatus, PropertyType } from '../property';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-property-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <span class="bold mt-3 mb-3" style="font-size: 2rem;">Ajouter une propriété</span>

      <form class="column gap-1" [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Rue, numéro(+ boite)</mat-label>
          <input
            type="text"
            matInput
            formControlName="street"
            placeholder="Ex. rue des gens heureux, 24 022"
          />
          @if (form.get('street')?.hasError('required')) {
          <mat-error>La rue est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Code postal</mat-label>
          <input type="text" matInput formControlName="postalCode" placeholder="Ex. 6032" />
          @if (form.get('postalCode')?.hasError('required')) {
          <mat-error>Le code postal est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Ville</mat-label>
          <input
            type="text"
            matInput
            formControlName="city"
            placeholder="Ex. Mont-sur-Marchienne"
          />
          @if (form.get('city')?.hasError('required')) {
          <mat-error>La ville est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Type de propriété</mat-label>
          <mat-select formControlName="propertyType">
            @for (propertyType of propertyTypes; track propertyType) {
            <mat-option [value]="propertyType">{{ propertyType }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Label</mat-label>
          <input type="text" matInput formControlName="label" placeholder="Ex. La tueuse" />
          @if (form.get('label')?.hasError('required')) {
          <mat-error>Le label est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <label for="image">Choisir une image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
        />

        <mat-form-field>
          <mat-label>Statut de la propriété</mat-label>
          <mat-select formControlName="propertyStatus">
            @for (propertyStatuss of propertyStatus; track propertyStatuss) {
            <mat-option [value]="propertyStatuss">{{ propertyStatuss }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Qui gère la propriété</mat-label>
          <mat-select formControlName="contextRole">
            @for (contextRole of contextRoles; track contextRole) {
            <mat-option [value]="contextRole">{{ contextRole }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <p>Les champs en dessous sont optionnels</p>

        <mat-form-field appearance="outline">
          <mat-label>Surface en m²</mat-label>
          <input matInput type="number" min="0" formControlName="surface" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Notes à propos de la propriété</mat-label>
          <textarea matInput formControlName="notes" rows="5"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>PEB</mat-label>
          <input type="text" matInput formControlName="pebScore" placeholder="Ex. F" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Année de construction</mat-label>
          <input matInput type="number" min="0" formControlName="yearBuilt" />
        </mat-form-field>

        <button [disabled]="form.invalid" matButton="filled" color="primary">
          Ajouter la propriété
        </button>
      </form>
    </div>
  `,
})
export class PropertyAddComponent {
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient, private router: Router) {}

  // Ajout
  private selectedImage: File | null = null;

  propertyTypes = Object.values(PropertyType).filter((value) => typeof value === 'string');
  propertyStatus = Object.values(PropertyStatus).filter((value) => typeof value === 'string');
  contextRoles = Object.values(ContextRole).filter((value) => typeof value === 'string');

  form = this.formBuilder.group({
    street: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    propertyType: ['', Validators.required],
    label: ['', Validators.required],
    //image: [null, Validators.required],
    // Ajout champ factice pour gérer la validation/affichage du nom de fichier
    imageName: [''],
    propertyStatus: ['', Validators.required],
    contextRole: ['', Validators.required],
    surface: [0, Validators.min(0)],
    notes: [''],
    pebScore: [''],
    yearBuilt: [0, Validators.min(0)],
  });

  // Ne plus patcher un File dans le form, mais un nom de fichier
  onFileSelected(event: any) {
    const file = event.target?.files?.[0] ?? null;
    this.selectedImage = file;
    this.form.patchValue({ imageName: file ? file.name : '' });
  }

  onSubmit() {
    const formData = new FormData();
    const v = this.form.value as any;
    /*Object.keys(formValue).forEach((key) => {
      if (key === 'image' && formValue.image) {
        formData.append(key, formValue.image); // fichier
      } else {
        formData.append(key, formValue[key]); // valeur du champ, pas tout l'objet
      }
    });*/

    // ADDED: joindre le fichier réel ici
    if (this.selectedImage){
      formData.append('image', this.selectedImage);
    }

    // CHANGED: on envoie les autres champs normalement
    formData.append('street', v.street);
    formData.append('postalCode', v.postalCode);
    formData.append('city', v.city);
    formData.append('propertyType', v.propertyType);
    formData.append('label', v.label);
    formData.append('propertyStatus', v.propertyStatus);
    formData.append('contextRole', v.contextRole);
    formData.append('surface', v.surface ?? '');
    formData.append('notes', v.notes ?? '');
    formData.append('pebScore', v.pebScore ?? '');
    formData.append('yearBuilt', v.yearBuilt ?? '');



    this.http.post(`${API_URL}/property/add`, formData).subscribe({
      next: () => {
        this.form.reset();
        this.snackBar.open('Ajout de la propriété avec succès!', 'Fermer');
        this.router.navigate(['/property/list']);
      },
      error: (err) => {
        this.snackBar.open("Erreur lors de l'ajout de la propriété!", 'Fermer');
        console.error(err);
      },
    });
  }
}
