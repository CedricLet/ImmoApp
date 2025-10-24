import { Component, computed, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ContextRole, Property, PropertyStatus, PropertyType } from '../property';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../property.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaseComponent } from '../../lease/lease';

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
    MatDatepickerModule,
    MatNativeDateModule,
    LeaseComponent,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <div class="column w-100 gap-2">
        <div class="row gap-1" style="align-self: flex-end;">
          @if (!editMode()) {
          <button (click)="editMode.set(true)" matButton="filled" color="primary">Modifier</button>
          <button (click)="deleteProperty()" matButton="filled" color="warn">
            Supprimer la propriété
          </button>
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
          @if (property?.imagePath) {
          <img
            [src]="'${API_URL}' + '/' + property?.imagePath"
            [alt]="property?.label"
            class="card"
            style="width: 15rem; height: 15rem;"
          />
          } @else {
          <div
            class="card row center"
            style="width: 15rem; height: 15rem; align-items:center; justify-content:center;"
          >
            <mat-icon>house</mat-icon>
          </div>
          }

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
              <span>{{ property?.label }}</span>
              }

              <br />

              <label for="">Type de propriété: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Type de propriété</mat-label>
                <mat-select formControlName="propertyType">
                  @for (propertyType of propertyTypes; track propertyType) {
                  <mat-option [value]="propertyType">{{ propertyType }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              } @else {
              <span>{{ property?.propertyType }}</span>
              }

              <br />

              <label for="">Statut: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Statut</mat-label>
                <mat-select formControlName="propertyStatus">
                  @for (propertyStatuss of filteredStatuses(); track propertyStatuss) {
                  <mat-option [value]="propertyStatuss">{{ propertyStatuss }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              } @else {
              <span>{{ property?.propertyStatus }}</span>
              }

              <br />

              <label for="">Qui gère le bien: </label>
              @if (editMode()) {
              <mat-form-field>
                <mat-label>Gestionnaire</mat-label>
                <mat-select formControlName="contextRole">
                  @for (contextRole of contextRoles; track contextRole) {
                  <mat-option [value]="contextRole">{{ contextRole }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              } @else {
              <span>{{ property?.contextRole }}</span>
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
              <span>{{ property?.street }}</span>
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
              <span>{{ property?.city }}</span>
              }

              <br />

              <label for="">Pays: </label>
              <span>{{ property?.country }}</span>

              <br />

              @if (editMode()) {
              <label for="image">Choisir une nouvelle image</label>
              <input id="image" type="file" accept="image/*" (change)="onFileSelected($event)" />
              }
            </form>
          </div>
        </div>

        <div class="column card" style="padding: 2rem;">
          <span style="font-size: 1.2rem;">Informations supplémentaire:</span>

          <form [formGroup]="form">
            <label for="">Année de construction: </label>
            @if (editMode()) {
            <mat-form-field appearance="outline">
              <mat-label>Année de construction</mat-label>
              <input matInput type="number" min="0" formControlName="yearBuilt" />
            </mat-form-field>
            } @else {
            <span>{{ property?.yearBuilt }}</span>
            }

            <br />

            <label for="">Surface en m²: </label>
            @if (editMode()) {
            <mat-form-field appearance="outline">
              <mat-label>Surface en m²</mat-label>
              <input matInput type="number" min="0" formControlName="surface" />
            </mat-form-field>
            } @else {
            <span>{{ property?.surface }}</span>
            }

            <br />

            <label for="">Score PEB: </label>
            @if (editMode()) {
            <mat-form-field appearance="outline">
              <mat-label>PEB</mat-label>
              <input type="text" matInput formControlName="pebScore" placeholder="Ex. F" />
            </mat-form-field>
            } @else {
            <span>{{ property?.pebScore }}</span>
            }

            <br />

            <label for="">Notes à propos de la propriété: </label>
            @if (editMode()) {
            <mat-form-field appearance="outline">
              <mat-label>Notes à propos de la propriété</mat-label>
              <textarea matInput formControlName="notes" rows="5"></textarea>
            </mat-form-field>
            } @else {
            <span>{{ property?.notes }}</span>
            }
          </form>
        </div>

        @if (property?.propertyStatus?.toString() === "RENTED" ||
        property?.propertyStatus?.toString() === "FOR_RENT") {
        <app-lease
          [currentPropertyStatus]="property?.propertyStatus"
          (propertyUpdated)="loadProperty()"
        ></app-lease>
        }
      </div>
    </div>
  `,
})
export class PropertyInfoComponent {
  propertyId!: string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  private snackBar = inject(MatSnackBar);
  private propertyService = inject(PropertyService);

  property: Property | null = null;
  editMode = signal(false);

  private selectedImage: File | null = null;

  propertyTypes = Object.values(PropertyType).filter((value) => typeof value === 'string');
  propertyStatus = Object.values(PropertyStatus).filter((value) => typeof value === 'string');
  contextRoles = Object.values(ContextRole).filter((value) => typeof value === 'string');

  loadProperty() {
    this.propertyService.getProperty(Number(this.propertyId)).subscribe({
      next: (prop) => {
        this.property = prop;

        this.form.patchValue({
          label: prop.label,
          propertyType: prop.propertyType as any,
          propertyStatus: prop.propertyStatus as any,
          street: prop.street,
          postalCode: prop.postalCode,
          city: prop.city,
          surface: prop.surface as any,
          notes: prop.notes,
          pebScore: prop.pebScore,
          yearBuilt: prop.yearBuilt as any,
          contextRole: prop.contextRole as any,
        });
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.loadProperty();
  }

  filteredStatuses = computed(() => {
    // Si la propriété est déjà louée, on retire "FOR_RENT"
    if (this.property?.propertyStatus.toString() === 'RENTED') {
      return this.propertyStatus.filter((status) => status !== 'FOR_RENT');
    }
    // Si elle n'est pas louée, on ne laisse pas la possibilité à l'utilisateur de mettre lui-même RENTED sans créer de contrat de leasing
    return this.propertyStatus.filter((status) => status !== 'RENTED');
  });

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    street: [this.property?.street, Validators.required],
    postalCode: [this.property?.postalCode, Validators.required],
    city: [this.property?.city, Validators.required],
    propertyType: [this.property?.propertyType, Validators.required],
    label: [this.property?.label, Validators.required],
    image: [null],
    propertyStatus: [this.property?.propertyStatus, Validators.required],
    contextRole: [this.property?.contextRole, Validators.required],
    surface: [this.property?.surface, Validators.min(0)],
    notes: [this.property?.notes],
    pebScore: [this.property?.pebScore],
    yearBuilt: [this.property?.yearBuilt, Validators.min(0)],
  });

  onFileSelected(event: any) {
    this.form.patchValue({ image: event.target.files[0] });
  }

  submitEdit() {
    const formData = new FormData();
    const formValue = this.form.value as any;
    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      // Si c'est le fichier, ajouter uniquement s'il y a un fichier
      if (key === 'image') {
        if (value) {
          formData.append(key, value);
        }
      } else {
        // Ajouter les autres champs normalement, convertir null/undefined en string vide si besoin
        formData.append(key, value != null ? value : '');
      }
    });

    this.http.post(`${API_URL}/property/modify/${this.propertyId}`, formData).subscribe({
      next: () => {
        this.form.reset();
        this.snackBar.open('Modification de la propriété avec succès!', 'Fermer');

        this.editMode.set(false);

        this.loadProperty();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la modification de la propriété!', 'Fermer');
      },
    });
  }

  deleteProperty() {
    this.http.delete(`${API_URL}/property/${this.propertyId}`).subscribe({
      next: () => {
        this.snackBar.open('Suppression de la propriété avec succès!', 'Fermer');
        this.router.navigate(['/property/list']);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression de la propriété!', 'Fermer');
      },
    });
  }
}
