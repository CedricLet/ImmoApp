import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { HomeComponent } from './home/home';
import { ConnexionComponent } from './connexion/connexion';
import { SignupComponent } from './signup/signup';
import { ProfileComponent } from './profile/profile';
import { PropertyListComponent } from './property/property-list/property-list';
import { PropertyInfoComponent } from './property/property-info/property-info';
import { NoAuthGuard } from './auth/no-auth.guard';
import { authGuard } from './auth/auth.guard';
import { PropertyAddComponent } from './property/property-add/property-add';
import { CostComponent } from './cost/cost';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'connexion', component: ConnexionComponent, canActivate: [NoAuthGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      {
        path: 'property',
        canActivate: [authGuard],
        children: [
          { path: 'list', component: PropertyListComponent, canActivate: [authGuard] },
          { path: 'add', component: PropertyAddComponent, canActivate: [authGuard] },
          { path: 'info/:id', component: PropertyInfoComponent, canActivate: [authGuard] },
          { path: 'cost/:id', component: CostComponent, canActivate: [authGuard] },
          { path: '', redirectTo: 'list', pathMatch: 'full' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
