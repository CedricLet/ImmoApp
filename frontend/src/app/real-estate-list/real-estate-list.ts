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
import { PageEvent, MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-real-estate-list',
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
    MatPaginator,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <div class="column w-100 gap-2">
        <div class="row" style="justify-content: space-between;">
          <mat-form-field>
            <mat-label>Rechercher un bien</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input type="text" matInput />
          </mat-form-field>

          <button matButton="filled" color="primary">
            <mat-icon>add</mat-icon>Ajouter un bien
          </button>
        </div>

        @for (property of properties; track property.id) {
        <div
          class="row w-100 card gap-3"
          style="padding: 0rem 2rem; align-items: center; justify-content: space-between;"
        >
          <img [src]="property.image" [alt]="property.label" style="width: 6rem; height: 6rem;" />
          <span>{{ property.type }}</span>
          <span>{{ property.label }}, {{ property.city }}</span>
          <button matButton="outlined" color="primary">Voir détails</button>
        </div>
        } @empty {
        <p>Aucun élément trouvé.</p>
        }

        <mat-paginator
          #paginator
          class="demo-paginator"
          (page)="handlePageEvent($event)"
          [length]="propertiesInfo.length"
          [pageSize]="10"
          [showFirstLastButtons]="true"
          [pageIndex]="true"
          aria-label="Select page"
        >
        </mat-paginator>
      </div>
    </div>
  `,
})
export class RealEstateListComponent {
  properties = [
    {
      id: 1,
      type: 'building',
      label: 'La chancla',
      city: 'Charleroi',
      image: '/28525110-a-spoof-female-human-target-shape-isolated-on-white.jpg',
    },
    {
      id: 2,
      type: 'apartment',
      label: 'La sourissière',
      city: 'Marcinelle',
      image: '/glock17.png',
    },
    { id: 3, type: 'house', label: 'La madre', city: 'Couillet', image: '/unnamed.jpg' },
  ];

  propertiesInfo = {
    length: 30,
  };

  handlePageEvent(event: PageEvent) {}
}
