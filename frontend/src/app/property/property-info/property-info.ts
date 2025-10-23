import { Component, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { ContextRole, Property, PropertyStatus, PropertyType } from '../property';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../property.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';

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
          @if (property?.imagePath) {
            <img
              [src]="'${API_URL}' + '/' + property?.imagePath"
              [alt]="property?.label"
              class="card"
              style="width: 15rem; height: 15rem;"
            />
          } @else {
            <div class="card row center" style="width: 15rem; height: 15rem; align-items:center; justify-content:center;">
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
                  @for (propertyStatuss of propertyStatus; track propertyStatuss) {
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
              <input
                id="image"
                type="file"
                accept="image/*"
                (change)="onFileSelected($event)"
              />
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

        <div class="row card" style="justify-content: space-between; padding: 2rem;">
          <form class="column gap-1" [formGroup]="addTenantForm">
            <mat-form-field>
              <mat-label>Nom complet</mat-label>
              <input type="text" matInput formControlName="fullName" placeholder="Ex. Dupont" />
              @if (addTenantForm.get('fullName')?.hasError('required')) {
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
              />
              @if (form.get('email')?.hasError('email') && !form.get('email')?.hasError('required'))
              {
              <mat-error>Entrez un adresse mail valide</mat-error>
              } @if (addTenantForm.get('email')?.hasError('required')) {
              <mat-error>L'email est <strong>obligatoire</strong></mat-error>
              }
            </mat-form-field>

            <mat-form-field>
              <mat-label>Numéro de téléphone</mat-label>
              <input type="text" matInput formControlName="phone" placeholder="Ex. 0477 08 09 44" />
              @if (addTenantForm.get('phone')?.hasError('required')) {
              <mat-error>Le numéro de téléphone est <strong>obligatoire</strong></mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Période</mat-label>
              <mat-date-range-input [rangePicker]="picker">
                <input matStartDate placeholder="Date début" formControlName="startDate" />
                <input matEndDate placeholder="Date fin" formControlName="endDate" />
              </mat-date-range-input>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-date-range-picker #picker></mat-date-range-picker>
              @if (addTenantForm.get('startDate')?.hasError('required')) {
              <mat-error>La date de début est <strong>obligatoire</strong></mat-error>
              } @if (addTenantForm.get('endDate')?.hasError('required')) {
              <mat-error>La date de fin est <strong>obligatoire</strong></mat-error>
              }
            </mat-form-field>

            <mat-form-field>
              <mat-label>Montant du loyer</mat-label>
              <input matInput type="number" min="0" formControlName="rentAmount" />
              @if (addTenantForm.get('rentAmount')?.hasError('required')) {
              <mat-error>La montant du loyer est <strong>obligatoire</strong></mat-error>
              }
            </mat-form-field>

            <mat-form-field>
              <mat-label>Jour du paiement</mat-label>
              <input matInput type="number" min="1" max="30" formControlName="paymentDay" />
              @if (addTenantForm.get('paymentDay')?.hasError('required')) {
              <mat-error>Le jour de paiement est <strong>obligatoire</strong></mat-error>
              }
            </mat-form-field>
          </form>
          <button
            (click)="addTenant()"
            [disabled]="addTenantForm.invalid"
            matButton="filled"
            color="primary"
          >
            Ajouter nouveau locataire
          </button>
        </div>
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

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    street: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    propertyType: ['', Validators.required],
    label: ['', Validators.required],
    imageName: [''],
    propertyStatus: ['', Validators.required],
    contextRole: ['', Validators.required],
    surface: [0, Validators.min(0)],
    notes: [''],
    pebScore: [''],
    yearBuilt: [0, Validators.min(0)],
  });


  ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;

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



  /*private formBuilder = inject(FormBuilder);

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
  });*/

  onFileSelected(event: any) {
    //this.form.patchValue({ image: event.target.files[0] });
    const file = event.target?.files?.[0] ?? null;
    this.selectedImage = file;                               // ADDED
    this.form.patchValue({ imageName: file ? file.name : '' });
  }

  submitEdit() {
    const formData = new FormData();
    const v = this.form.value as any;
    //const formValue = this.form.value as any;
    /*Object.keys(formValue).forEach((key) => {
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
    });*/


    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

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


    this.http.post(`${API_URL}/property/modify/${this.propertyId}`, formData).subscribe({
      next: () => {
        this.form.reset();
        this.snackBar.open('Modification de la propriété avec succès!', 'Fermer');

        this.editMode.set(false);

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
              imageName: ''
            });
            this.selectedImage = null;
          },
          error: (err) => console.error(err),
        });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la modification de la propriété!', 'Fermer');
      },
    });
  }

  addTenantForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    rentAmount: [null, [Validators.min(0), Validators.required]],
    paymentDay: [null, [Validators.min(0), Validators.max(30), Validators.required]],
  });

  addTenant() {}
}
