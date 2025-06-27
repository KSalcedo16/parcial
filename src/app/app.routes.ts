import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EstadisticasComponent } from './components/estadisticas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'estadisticas', component: EstadisticasComponent }

];

