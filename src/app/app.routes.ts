import { Routes } from '@angular/router';
import {adminGuard} from './guards/admin-guard';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home-page/home-page')
  },
  {
    path: 'estaciones',
    loadComponent: () => import('./pages/estaciones/estaciones-page/estaciones-page')
  },
  {
    path: 'estaciones/:id',
    loadComponent: () => import('./pages/estacion-detalle-page/estacion-detalle-page')
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login-page/login-page')
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/resigtro/registro-page/registro-page')
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favoritos-page/favoritos-page'),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-page/admin-page'),
    canActivate: [adminGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil'),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
