import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { HomeComponent } from './home/home';
import { ConnexionComponent } from './connexion/connexion';
import { SignupComponent } from './signup/signup';
import { ProfileComponent } from './profile/profile';
import { RealEstateListComponent } from './real-estate-list/real-estate-list';
import { PropertyInfoComponent } from './property-info/property-info';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'connexion', component: ConnexionComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'real-estate-list', component: RealEstateListComponent },
      { path: 'property-info', component: PropertyInfoComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
