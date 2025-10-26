import { Component, computed, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, MatMenuModule],
  styles: [
    `
      header {
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      mat-toolbar {
        display: flex;
        align-items: center;
        padding: 0 7rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      }

      button {
        margin: 0 1rem;
      }

      .sub-header {
        height: 48px;
        font-size: 0.9rem;
        justify-content: center;
      }
    `,
  ],
  template: `
    <header>
      <!-- HEADER PRINCIPAL -->
      <mat-toolbar>
        <!-- <button matIconButton class="example-icon" aria-label="Example icon-button with menu icon">
          <mat-icon>menu</mat-icon>
        </button> -->
        <h2 [routerLink]="'/'" style="font-size: 2rem; cursor: pointer;" class="primary">
          ImmoApp
        </h2>
        <span class="spacer"></span>
        @if (authService.isLoggedIn()) {
        <button
          matButton
          [routerLink]="'/property/list'"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Mes propriétés
        </button>

        <button mat-icon-button aria-label="Profile" color="primary" [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item [routerLink]="'/profile'">
            <mat-icon>person</mat-icon>
            <span>Profil</span>
          </button>

          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>logout</mat-icon>
            <span style="color: red;">Déconnexion</span>
          </button>
        </mat-menu>

        } @else {
        <button matButton [routerLink]="'/connexion'">Se connecter</button>
        <button [routerLink]="'/signup'" matButton="filled" color="primary">S'inscrire</button>
        }
      </mat-toolbar>

      <!-- SOUS-HEADER (affiché seulement si on est sur /property/...) -->
      @if (isPropertyDetailRoute()) {
      <mat-toolbar class="sub-header">
        <div>
          <button mat-button [routerLink]="'/property/list'">Liste</button>
          <button mat-button [routerLink]="'/property/info/' + propertyId()">Infos</button>
          <button mat-button [routerLink]="'/property/cost/' + propertyId()">
            Dépenses/Revenues
          </button>
          <button mat-button [routerLink]="'/property/document/' + propertyId()"> Documents </button>
        </div>
      </mat-toolbar>
      }
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  currentUrl = signal<string>(this.router.url);

  // Vérifie si on est sur /property/info/:id ou /property/cost/:id
  isPropertyDetailRoute = computed(() => {
    const url = this.currentUrl();
    return /^\/property\/(info|cost|document)\/\d+$/.test(url);
  });

  // Extrait l’ID de la propriété courante
  propertyId = computed(() => {
    const match = this.currentUrl().match(/\/(\d+)(?:$|[?#])/);
    return match ? match[1] : null;
  });

  constructor() {
    // Met à jour le signal à chaque navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl.set(event.urlAfterRedirects);
        }
      });
  }
}
