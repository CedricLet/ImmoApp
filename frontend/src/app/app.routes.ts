import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { HomeComponent } from './home/home';
import { ConnexionComponent } from './connexion/connexion';
import { SignupComponent } from './signup/signup';
import { ProfileComponent } from './profile/profile';
import { RealEstateListComponent } from './real-estate-list/real-estate-list';
import { PropertyInfoComponent } from './property-info/property-info';
import { NoAuthGuard } from './auth/no-auth.guard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'connexion', component: ConnexionComponent, canActivate: [NoAuthGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'real-estate-list', component: RealEstateListComponent, canActivate: [authGuard] },
      { path: 'property-info', component: PropertyInfoComponent, canActivate: [authGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
