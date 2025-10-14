import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatDividerModule, MatIconModule],
  styles: [
    `
      footer {
        padding: 3rem 10rem;
        background-color: #f6f6f6;

        i {
          font-size: 1.5rem;
        }
      }
    `,
  ],
  template: `
    <footer>
      <div class="column">
        <div class="row mb-3" style="justify-content: space-between;">
          <div class="column">
            <span class="mb-1" style="font-size: 1.2rem; font-weight: bold;">ImmoApp</span>
            <span>ImmoApp SAS</span><span>123 Avenue des Champs-Élysées</span
            ><span>75008 Paris, France</span><span>SIRET: 123 456 789 00012</span>
          </div>
          <div class="column">
            <span class="mb-1" style="font-size: 1.2rem; font-weight: bold;">Contact</span>
            <span class="mb-05">Email: contact@immoapp.com</span
            ><span class="mb-05">Téléphone: +33 1 23 45 67 89</span
            ><span>Support: support@immoapp.com</span>
          </div>
          <div class="column">
            <span class="mb-1" style="font-size: 1.2rem; font-weight: bold;">Liens utiles</span>
            <a class="mb-05" href="">À propos</a><a class="mb-05" href="">Blog</a
            ><a class="mb-05" href="">Carrières</a><a class="mb-05" href="">FAQ</a>
          </div>
          <div class="column">
            <span class="mb-1" style="font-size: 1.2rem; font-weight: bold;">Mentions légales</span>
            <a href="" class="mb-05">Conditions générales d'utilisation</a
            ><a href="" class="mb-05">Polotique de confidentialité</a
            ><a href="" class="mb-05">Politique de cookies</a
            ><a href="" class="mb-05">Mentions légales</a>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="row mt-3" style="justify-content: space-between;">
          <p>@ 2025 ImmopApp SAS. Tous droits réservés.</p>
          <nav class="row gap-2" style="align-items: center;">
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-linkedin"></i>
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-instagram"></i>
          </nav>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
