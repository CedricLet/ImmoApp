import { Component, ViewChild, inject, signal } from '@angular/core';
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
import { PropertyService } from '../property.service';
import { HttpClient } from '@angular/common/http';
import { Properties } from '../property';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {API_URL} from '../../constants';

@Component({
  selector: 'app-property-list',
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
    MatPaginatorModule,
    RouterModule,
  ],
  styles: [``],
  template: `
    <div class="column" style="align-items: center; padding: 6rem 10rem">
      <div class="column w-100 gap-2">
        <div class="row" style="justify-content: space-between;">
          <mat-form-field>
            <mat-label>Rechercher un bien</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input type="text" matInput (input)="onSearchChange($any($event.target).value)"/>
          </mat-form-field>

          <button [routerLink]="'/property/add'" matButton="filled" color="primary">
            <mat-icon>add</mat-icon>
            Ajouter un bien
          </button>
        </div>

        @for (property of properties; track property.id) {
          <div
            class="row w-100 card gap-3"
            style="padding: 0rem 2rem; align-items: center; justify-content: space-between;"
          >
            @if (property?.imagePath) {
              <img
                [src]="'${API_URL}' + '/' + property.imagePath"
                [alt]="property.label"
                style="width: 6rem; height: 6rem;"
              />

            } @else {
              <div class="row center"
                   style="width: 6rem; height: 6rem; border-radius: .5rem; background:#f3f4f6; align-items:center; justify-content:center;">
                <mat-icon>image_not_supported</mat-icon>
              </div>

            }
            <span>{{ property.propertyType }}</span>
            <span>{{ property.label }}, {{ property.city }}</span>
            <button
              [routerLink]="'/property/info/' + property.id"
              matButton="outlined"
              color="primary"
            >
              Voir détails
            </button>
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
          [pageIndex]="propertiesInfo.pageIndex"
          aria-label="Select page"
        >
        </mat-paginator>
      </div>
    </div>
  `,
})
export class PropertyListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private propertyService = inject(PropertyService);

  constructor(private http: HttpClient, private router: Router) {}

  properties: Properties[] | null = null;

  propertiesInfo = {
    length: 0,
    pageIndex: 0,
  };

  searchTerm = '';

  loadProperties() {
    this.propertyService
      .getProperties(this.paginator.pageIndex, this.searchTerm)
      .subscribe((res) => {
        this.properties = res.content;
        this.propertiesInfo.length = res.totalElements;
      });
  }

  ngAfterViewInit() {
    this.loadProperties();
  }

  handlePageEvent(event: PageEvent) {
    this.propertiesInfo.pageIndex = event.pageIndex;
    this.loadProperties();
  }

  onSearchChange(searchValue: string) {
    this.searchTerm = searchValue;
    this.propertiesInfo.pageIndex = 0;
    this.loadProperties();
  }
}
