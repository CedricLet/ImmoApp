import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  styles: [
    `
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 10rem;
      }

      .card-container {
        display: flex;
        gap: 2rem;
      }

      .card {
        padding: 1rem;
        width: 20rem;
        gap: 1rem;

        mat-icon {
          font-size: 2.5rem;
          width: 4rem;
          height: 2rem;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
    `,
  ],
  template: `
    <main>
      <span class="primary mt-3" style="font-size: 4rem;">Gérez vos biens immobiliés</span>
      <span class="primary mt-2" style="font-size: 4rem;">en toute simplicité</span>
      <span class="mt-4" style="font-size: 1.2rem;"
        >Une solution complète pour la gestion de vos propriétés, le suivi des locations et la</span
      >
      <span class="mb-3" style="font-size: 1.2rem;">communicationavec vos locataires.</span>
      <div style="display: flex; gap: 1rem;">
        <button matButton="filled" color="primary">Commencer gratuitement</button>
        <button matButton="outlined" color="primary">Se connecter</button>
      </div>

      <div class="card-container mt-6">
        <div class="card">
          <mat-icon class="material-symbols-outlined" color="primary">grouped_bar_chart</mat-icon>
          <p class="card-title">Tableau de bord intuitif</p>
          <p>Visualisez vos revenus, suivez vos propriétés et gérez vos tâches en un coup d'oeil</p>
        </div>
        <div class="card">
          <mat-icon class="material-symbols-outlined" color="primary">house</mat-icon>
          <p class="card-title">Gestion des propriétés</p>
          <p>Gérez facilement vos biens, les contrats et les documents associés</p>
        </div>
        <div class="card">
          <mat-icon class="material-symbols-outlined" color="primary">sms</mat-icon>
          <p class="card-title">Communication simplifiée</p>
          <p>Restez en contact avec vos locataires et gérez les demandes efficacement</p>
        </div>
      </div>

      <span class="mt-6" style="font-size: 2rem; font-weight: bold;">À propos d'ImmoApp</span>
      <span class="mt-2 mb-3" style="font-size: 1.2rem;"
        >Découvrez comment notre plateforme révolutionne la gestion immobilière</span
      >

      <div class="row gap-2" style="align-self: flex-start;">
        <div class="column gap-1" style="width: 40rem;">
          <span style="font-size: 1.5rem; font-weight: bold;">Notre mission</span>
          <span
            >Fondée en 2023, ImmoApp a pour mission de simplifier la gestion immobilière pour les
            propriétaires et les gestionnaires de biens. Notre plateforme intuitive permet de
            centraliser toutes les informations et communications liées à vos propriétés.
          </span>
          <span
            >Nous croyons que la technologie doit être au service de l'humain, c'est pourquoi nous
            développons des outils qui vous font gagner du temps et réduisent le stress lié à la
            gestion immobilière.
          </span>
        </div>

        <div class="column gap-1">
          <span style="font-size: 1.5rem; font-weight: bold;">Notre équipe</span>
          <div class="row gap-05">
            <span class="profile">ML</span>
            <div class="column">
              <span class="bold">Marie Lefèvre</span><span>Fondatrice & CEO</span>
            </div>
          </div>
          <div class="row gap-05">
            <span class="profile">TD</span>
            <div class="column">
              <span class="bold">Thomas Dubois</span><span>Co-fondateur & CTO</span>
            </div>
          </div>
          <div class="row gap-05">
            <span class="profile">SB</span>
            <div class="column">
              <span class="bold">Sophie Bernard</span><span>Directrice des opérations</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
})
export class HomeComponent {}
