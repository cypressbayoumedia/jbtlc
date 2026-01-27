import { Routes } from '@angular/router';

export const routes: Routes = [
        { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
        { path: 'pos', loadComponent: () => import('./pages/pos/pos').then(m => m.PosComponent) }

];
