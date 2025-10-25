import { Component, computed, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { Cost, CostCategory, CostType } from './costType';
import { PageEvent, MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modify-cost',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NativeDateModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogActions,
    MatDialogContent,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 3rem 5rem">
      <h2 mat-dialog-title>Informations sur la facture</h2>
      <mat-dialog-content>
        <form class="column gap-1" [formGroup]="form">
          <mat-form-field>
            <mat-label>Libellé</mat-label>
            <input type="text" matInput formControlName="label" placeholder="Ex. facture gaz" />
            @if (form.get('label')?.hasError('required')) {
            <mat-error>Le libellé est <strong>obligatoire</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field>
            <mat-label>Catégorie de la facture</mat-label>
            <mat-select formControlName="costCategory">
              @for (costCategory of costCategories; track costCategory) {
              <mat-option [value]="costCategory">{{ costCategory }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Devise</mat-label>
            <input
              type="text"
              matInput
              formControlName="currency"
              placeholder="Ex. EUR"
              [readonly]="true"
            />
            @if (form.get('currency')?.hasError('required')) {
            <mat-error>La devise est <strong>obligatoire</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field>
            <mat-label>Montant</mat-label>
            <input matInput type="number" min="0" formControlName="amount" />
            @if (form.get('amount')?.hasError('required')) {
            <mat-error>Le montant de la facture est <strong>obligatoire</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field>
            <mat-label>Date de la facture</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (form.get('date')?.hasError('required')) {
            <mat-error>La date est <strong>obligatoire</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field>
            <mat-label>Type de facture</mat-label>
            <mat-select formControlName="costType">
              @for (costType of costTypes; track costType) {
              <mat-option [value]="costType">{{ costType }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Notes à propos de la facture</mat-label>
            <textarea matInput formControlName="notes" rows="5"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button
          class="mt-2"
          [disabled]="form.invalid"
          matButton="filled"
          color="primary"
          (click)="onSubmit()"
        >
          Modifier la facture
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ModifyCostComponent {
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef);

  cost: Cost | null = null;
  costId = this.data.id;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  loadCost() {
    this.http.get<Cost>(`${API_URL}/cost/${this.costId}`).subscribe({
      next: (cost) => {
        this.form.patchValue({
          label: cost.label,
          costCategory: cost.costCategory,
          currency: cost.currency,
          amount: cost.amount,
          date: new Date(cost.date),
          costType: cost.costType,
          notes: cost.notes,
        });
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit() {
    this.loadCost();
  }

  costTypes = Object.values(CostType).filter((value) => typeof value === 'string');
  costCategories = Object.values(CostCategory).filter((value) => typeof value === 'string');

  form = this.formBuilder.group({
    label: ['', Validators.required],
    costCategory: ['', Validators.required],
    currency: ['EUR', Validators.required],
    amount: [0, [Validators.min(0), Validators.required]],
    date: [new Date(), Validators.required],
    costType: ['', Validators.required],
    notes: [''],
  });

  onSubmit() {
    const formData = new FormData();
    const formValue = this.form.value as any;
    Object.keys(formValue).forEach((key) => {
      if (key === 'date' && formValue.date) {
        formData.append('date', formValue.date.toISOString().split('T')[0]); // format date
      } else {
        formData.append(key, formValue[key]); // tous les autres champs
      }
    });

    this.http.post(`${API_URL}/cost/modify/${this.costId}`, formData).subscribe({
      next: () => {
        this.form.reset();
        this.snackBar.open('Modification de la facture avec succès!', 'Fermer');
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la modification de la facture!', 'Fermer');
        console.error(err);
      },
    });
  }
}
