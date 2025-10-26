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
import { Cost, CostCategory, CostType, CostAccounting } from './costType';
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
import { ModifyCostComponent } from './modify-cost';
import { CommonModule } from '@angular/common';
import {LabelFrPipe} from '../i18n/label-fr.pipe';

@Component({
  selector: 'app-cost',
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
    MatPaginator,
    MatTableModule,
    CommonModule,
    LabelFrPipe,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <div class="row w-100 gap-1 mb-3" style="justify-content: space-between;">
        <div class="card column w-100" style="align-items: center; padding: 2rem;">
          <span class="bold" style="color: green; font-size: 3rem; margin: 2rem;"
            >{{ costAccounting.earnings }} €</span
          ><span style="font-size: 1.2rem;">Gain total</span>
        </div>
        <div class="card column w-100" style="align-items: center; padding: 2rem;">
          <span class="bold" style="color: red; font-size: 3rem; margin: 2rem;"
            >{{ costAccounting.expenses }} €</span
          ><span style="font-size: 1.2rem;">Dépense total</span>
        </div>
        <div class="card column w-100" style="align-items: center; padding: 2rem;">
          <span class="bold" style="color: steelblue; font-size: 3rem; margin: 2rem;"
            >{{ costAccounting.balance }} €</span
          ><span style="font-size: 1.2rem;">Solde</span>
        </div>
      </div>

      <mat-form-field style="align-self: flex-start;">
        <mat-label>Rechercher une facture</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input type="text" matInput (input)="onSearchChange($any($event.target).value)" />
      </mat-form-field>

      <div class="w-100 mb-3">
        <table mat-table [dataSource]="dataSource">
          <!-- Label Column -->
          <ng-container matColumnDef="label">
            <th mat-header-cell *matHeaderCellDef>Libellé</th>
            <td mat-cell *matCellDef="let element">{{ element?.label }}</td>
          </ng-container>

          <!-- costCategory Column -->
          <ng-container matColumnDef="costCategory">
            <th mat-header-cell *matHeaderCellDef>Catégorie de facture</th>
            <td mat-cell *matCellDef="let element">{{ element?.costCategory | labelFr:'costCategory' }}</td>
          </ng-container>

          <!-- costType Column -->
          <ng-container matColumnDef="costType">
            <th mat-header-cell *matHeaderCellDef>Type de facture</th>
            <td mat-cell *matCellDef="let element">{{ element?.costType | labelFr:'costType' }}</td>
          </ng-container>

          <!-- Currency Column -->
          <ng-container matColumnDef="currency">
            <th mat-header-cell *matHeaderCellDef>Devise</th>
            <td mat-cell *matCellDef="let element">{{ element?.currency }}</td>
          </ng-container>

          <!-- Amount Column -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Montant</th>
            <td mat-cell *matCellDef="let element">{{ element?.amount }}</td>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let element">{{ element?.date | date:'dd-MM-yyyy':'Europe/Brussels' }}</td>
          </ng-container>

          <!-- Notes Column -->
          <ng-container matColumnDef="notes">
            <th mat-header-cell *matHeaderCellDef>Notes</th>
            <td mat-cell *matCellDef="let element">
              {{
                element?.notes?.length > 50
                  ? (element?.notes | slice : 0 : 50) + '…'
                  : element?.notes
              }}
            </td>
          </ng-container>

          <!-- Buttons Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef style="text-align: center;">Action</th>
            <td mat-cell *matCellDef="let element">
              <div class="row gap-1" style="justify-content: center;">
                <button (click)="openDialog(element?.id)" matButton="filled" color="primary">
                  Modifier
                </button>
                <button (click)="deleteCost(element?.id)" matButton="filled" color="warn">
                  Supprimer
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mat-paginator
          (page)="handlePageEvent($event)"
          [pageSize]="10"
          [length]="costsInfo.length"
          [pageIndex]="costsInfo.pageIndex"
          showFirstLastButtons
          aria-label="Select page of periodic elements"
        >
        </mat-paginator>
      </div>

      <form class="column gap-1" [formGroup]="form" (ngSubmit)="onSubmit()">
        <!--
        <label for="document">Choisir un document PDF (facultatif)</label>
        <input id="document" type="file" accept=".pdf" (change)="onFileSelected($event)" />
        -->

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
            <mat-option [value]="costCategory">{{ costCategory | labelFr:'costCategory' }}</mat-option>
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
            <mat-option [value]="costType">{{ costType | labelFr:'costType' }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Notes à propos de la facture</mat-label>
          <textarea matInput formControlName="notes" rows="5"></textarea>
        </mat-form-field>

        <button [disabled]="form.invalid" matButton="filled" color="primary">
          Ajouter le coût
        </button>
      </form>
    </div>
  `,
})
export class CostComponent {
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  propertyId!: string;

  costs: Cost[] | null = null;

  costAccounting: CostAccounting = {
    earnings: 0,
    expenses: 0,
    balance: 0,
  };

  searchTerm = '';

  costsInfo = {
    length: 0,
    pageIndex: 0,
  };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  onSearchChange(searchValue: string) {
    this.searchTerm = searchValue;
    this.costsInfo.length = 0;
    this.loadCosts();
  }

  handlePageEvent(event: PageEvent) {
    this.costsInfo.pageIndex = event.pageIndex;
    this.loadCosts();
  }

  loadCostAccounting() {
    this.http.get<CostAccounting>(`${API_URL}/cost/accounting/${this.propertyId}`).subscribe({
      next: (accounting) => {
        this.costAccounting.earnings = accounting.earnings;
        this.costAccounting.expenses = accounting.expenses;
        this.costAccounting.balance = accounting.balance;
      },
      error: () => {
        this.costAccounting = {
          earnings: 0,
          expenses: 0,
          balance: 0,
        };
      },
    });
  }

  loadCosts() {
    this.http
      .get<{ content: Cost[]; totalElements: number }>(`${API_URL}/cost/list/${this.propertyId}`, {
        params: {
          page: this.costsInfo.pageIndex.toString(),
          search: this.searchTerm,
        },
      })
      .subscribe({
        next: (res) => {
          this.costs = res.content;
          this.dataSource.data = this.costs;
          this.costsInfo.length = res.totalElements;

          this.loadCostAccounting();
        },
        error: (err) => console.error(err),
      });
  }

  ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.loadCosts();
  }

  costTypes = Object.values(CostType).filter((value) => typeof value === 'string');
  costCategories = Object.values(CostCategory).filter((value) => typeof value === 'string');

  displayedColumns = [
    'label',
    'costCategory',
    'costType',
    'currency',
    'amount',
    'date',
    'notes',
    'action',
  ];

  dataSource = new MatTableDataSource<Cost>([]);

  form = this.formBuilder.group({
    document: [null],
    label: ['', Validators.required],
    costCategory: ['', Validators.required],
    currency: ['EUR', Validators.required],
    amount: [0, [Validators.min(0), Validators.required]],
    date: [null, Validators.required],
    costType: ['', Validators.required],
    notes: [''],
  });

  onFileSelected(event: any) {
    this.form.patchValue({ document: event.target.files[0] });
  }

  onSubmit() {
    const formData = new FormData();
    const formValue = this.form.value as any;
    Object.keys(formValue).forEach((key) => {
      if (key === 'document') {
        if (formValue.document) {
          formData.append('document', formValue.document); // uniquement si fichier
        }
      } else if (key === 'date' && formValue.date) {
        formData.append('date', formValue.date.toISOString().split('T')[0]); // format date
      } else {
        formData.append(key, formValue[key]); // tous les autres champs
      }
    });

    this.http.post(`${API_URL}/cost/add/${this.propertyId}`, formData).subscribe({
      next: () => {
        this.form.patchValue({
          document: null,
          label: '',
          costCategory: '',
          currency: 'EUR',
          amount: 0,
          date: null,
          costType: '',
          notes: '',
        });
        this.snackBar.open('Ajout de la facture avec succès!', 'Fermer');
        this.loadCosts();
      },
      error: (err) => {
        this.snackBar.open("Erreur lors de l'ajout de la facture!", 'Fermer');
        console.error(err);
      },
    });
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ModifyCostComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadCosts();
    });
  }

  deleteCost(id: number) {
    this.http.delete(`${API_URL}/cost/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Suppression de la facture avec succès!', 'Fermer');
        this.loadCosts();
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la suppression de la facture!', 'Fermer');
        console.error(err);
      },
    });
  }
}
