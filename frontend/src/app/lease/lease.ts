import { Component, inject, input, signal, effect } from '@angular/core';
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
import { ContextRole, Property, PropertyStatus, PropertyType } from '../property/property';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../property/property.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lease } from './leaseType';

@Component({
  selector: 'app-lease',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  styles: [``],
  template: `
    <div class="row card" style="justify-content: space-between; padding: 2rem;">
      <form class="column gap-1" [formGroup]="form">
        <mat-form-field>
          <mat-label>Nom complet</mat-label>
          <input
            type="text"
            matInput
            formControlName="fullName"
            placeholder="Ex. Dupont"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          />
          @if (form.get('fullName')?.hasError('required')) {
          <mat-error>Le nom complet est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Adresse email</mat-label>
          <input
            type="email"
            matInput
            formControlName="email"
            placeholder="Ex. pat@example.com"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          />
          @if (form.get('email')?.hasError('email') && !form.get('email')?.hasError('required')) {
          <mat-error>Entrez un adresse mail valide</mat-error>
          } @if (form.get('email')?.hasError('required')) {
          <mat-error>L'email est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Numéro de téléphone</mat-label>
          <input
            type="text"
            matInput
            formControlName="phone"
            placeholder="Ex. 0477 08 09 44"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          />
          @if (form.get('phone')?.hasError('required')) {
          <mat-error>Le numéro de téléphone est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Période</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input
              matStartDate
              placeholder="Date début"
              formControlName="startDate"
              [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
            />
            <input
              matEndDate
              placeholder="Date fin"
              formControlName="endDate"
              [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
            />
          </mat-date-range-input>
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
            [disabled]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          ></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
          @if (form.get('startDate')?.hasError('required')) {
          <mat-error>La date de début est <strong>obligatoire</strong></mat-error>
          } @if (form.get('endDate')?.hasError('required')) {
          <mat-error>La date de fin est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Montant du loyer</mat-label>
          <input
            matInput
            type="number"
            min="0"
            formControlName="rentAmount"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          />
          @if (form.get('rentAmount')?.hasError('required')) {
          <mat-error>La montant du loyer est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Jour du paiement</mat-label>
          <input
            matInput
            type="number"
            min="1"
            max="30"
            formControlName="paymentDay"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          />
          @if (form.get('paymentDay')?.hasError('required')) {
          <mat-error>Le jour de paiement est <strong>obligatoire</strong></mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Montant de la caution</mat-label>
          <input
            matInput
            type="number"
            min="0"
            formControlName="depositAmount"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Notes à propos du locataire</mat-label>
          <textarea
            matInput
            formControlName="notes"
            rows="5"
            [readonly]="!editMode() && currentPropertyStatus.toString().includes('RENTED')"
          ></textarea>
        </mat-form-field>
      </form>
      @if (currentPropertyStatus()?.toString() === "FOR_RENT") {
      <button (click)="addLease()" [disabled]="form.invalid" matButton="filled" color="primary">
        Ajouter nouveau locataire
      </button>
      } @else { @if (!editMode()) {
      <div class="row gap-1">
        <button (click)="editMode.set(true)" matButton="filled" color="primary">Modifier</button>
        <button matButton="filled" color="warn">Supprimer</button>
      </div>
      } @else {
      <div class="row gap-1">
        <button (click)="editLease()" [disabled]="form.invalid" matButton="filled" color="primary">
          Valider</button
        ><button (click)="editMode.set(false)" matButton="outlined" color="primary">Annuler</button>
      </div>
      } }
    </div>
  `,
})
export class LeaseComponent {
  propertyId!: string;
  private snackBar = inject(MatSnackBar);

  currentPropertyStatus = input.required<PropertyStatus | undefined>();

  lease?: Lease;

  propertyStatus = Object.values(PropertyStatus).filter((value) => typeof value === 'string');

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;

    effect(() => {
      if (this.currentPropertyStatus()?.toString() === 'RENTED') {
        console.log('editMode:', this.editMode());
        console.log('currentPropertyStatus:', this.currentPropertyStatus.toString());

        this.http.get<Lease>(`${API_URL}/lease/${this.propertyId}`).subscribe({
          next: (lease) => {
            this.lease = lease;
            console.log('Lease récupéré :', lease);

            this.form.patchValue({
              fullName: lease.fullName,
              email: lease.email,
              phone: lease.phone,
              rentAmount: lease.rentAmount,
              paymentDay: lease.paymentDay,
              depositAmount: lease.depositAmount,
              notes: lease.notes,
              startDate: new Date(lease.startDate),
              endDate: new Date(lease.endDate),
            });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la récupération de la location!', 'Fermer');
          },
        });
      }
    });
  }

  private propertyService = inject(PropertyService);

  property: Property | null = null;

  editMode = signal(false);

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    fullName: [this.lease?.fullName, Validators.required],
    email: [this.lease?.email, [Validators.required, Validators.email]],
    phone: [this.lease?.phone, Validators.required],
    rentAmount: [this.lease?.rentAmount, [Validators.min(0), Validators.required]],
    paymentDay: [
      this.lease?.paymentDay,
      [Validators.min(0), Validators.max(30), Validators.required],
    ],
    depositAmount: [this.lease?.depositAmount, [Validators.min(0), Validators.required]],
    notes: [this.lease?.notes],
    startDate: [this.lease?.startDate ? new Date(this.lease.startDate) : null, Validators.required],
    endDate: [this.lease?.endDate ? new Date(this.lease.endDate) : null, Validators.required],
  });

  addLease() {
    const formData = new FormData();
    const formValue = this.form.value as any;
    Object.keys(formValue).forEach((key) => {
      if (key === 'startDate' || key === 'endDate') {
        formData.append(key, formValue?.[key].toISOString().split('T')[0]); // "2025-10-22"
      } else {
        formData.append(key, formValue[key]); // valeur du champ, pas tout l'objet
      }
    });

    this.http.post(`${API_URL}/lease/add/${this.propertyId}`, formData).subscribe({
      next: () => {
        this.snackBar.open('Ajout de la location avec succès!', 'Fermer');

        this.http.get<Lease>(`${API_URL}/lease/${this.propertyId}`).subscribe({
          next: (lease) => {
            this.lease = lease;
            this.form.patchValue({
              fullName: lease.fullName,
              email: lease.email,
              phone: lease.phone,
              rentAmount: lease.rentAmount,
              paymentDay: lease.paymentDay,
              depositAmount: lease.depositAmount,
              notes: lease.notes,
              startDate: new Date(lease.startDate),
              endDate: new Date(lease.endDate),
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la récupération de la location!', 'Fermer');
            console.log('la fameuse erreur ' + error);
          },
        });
      },
      error: () => {
        this.snackBar.open("Erreur lors de l'ajout de la location!", 'Fermer');
      },
    });
  }

  editLease() {
    const formData = new FormData();
    const formValue = this.form.value as any;
    Object.keys(formValue).forEach((key) => {
      if (key === 'startDate' || key === 'endDate') {
        formData.append(key, formValue?.[key].toISOString().split('T')[0]); // "2025-10-22"
      } else {
        formData.append(key, formValue[key]); // valeur du champ, pas tout l'objet
      }
    });

    this.http.post(`${API_URL}/lease/modify/${this.propertyId}`, formData).subscribe({
      next: () => {
        this.snackBar.open('Modification de la location avec succès!', 'Fermer');
        this.editMode.set(false);
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la modification de la location!', 'Fermer');
      },
    });
  }
}
