import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'our-story',
    loadComponent: () => import('./pages/our-story/our-story').then(m => m.OurStoryComponent),
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop').then(m => m.ShopComponent),
  },
  {
    path: 'tea-collections',
    loadComponent: () => import('./pages/tea-collections/tea-collections').then(m => m.TeaCollectionsComponent),
  },
  {
    path: 'learn',
    loadComponent: () => import('./pages/learn/learn').then(m => m.LearnComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent),
  },
  {
    path: 'buy',
    loadComponent: () => import('./pages/pos/pos').then(m => m.PosComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
