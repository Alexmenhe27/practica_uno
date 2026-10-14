import { Routes } from '@angular/router';
import { sesionGuard, loginGuard } from './servicios/sesion.guard';

// Todas las pantallas (menos el login y el registro) tienen "canActivate: [sesionGuard]":
// si no has iniciado sesión, te regresan al login.
// El registro queda abierto para poder "Crear cuenta" desde el login.
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate: [loginGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [sesionGuard]
  },
  {
    path: 'detalle',
    loadComponent: () => import('./detalles/detalles.page').then( m => m.DetallesPage),
    canActivate: [sesionGuard]
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'gestion-alumnos',
    loadComponent: () => import('./gestion-alumnos/gestion-alumnos.page').then( m => m.GestionAlumnosPage),
    canActivate: [sesionGuard]
  },
  {
    path: 'gestion-carreras',
    loadComponent: () => import('./gestion-carreras/gestion-carreras.page').then( m => m.GestionCarrerasPage),
    canActivate: [sesionGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];
