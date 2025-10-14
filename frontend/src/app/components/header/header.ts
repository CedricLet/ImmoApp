import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';

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
    `,
  ],
  template: `
    <header>
      <mat-toolbar>
        <!-- <button matIconButton class="example-icon" aria-label="Example icon-button with menu icon">
          <mat-icon>menu</mat-icon>
        </button> -->
        <h2 [routerLink]="'/'" style="font-size: 2rem; cursor: pointer;" class="primary">
          ImmoApp
        </h2>
        <span class="spacer"></span>
        @if (authService.isLoggedIn()) {
        <button mat-icon-button aria-label="Profile" color="primary" [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="goToProfile()">
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
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);

  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
