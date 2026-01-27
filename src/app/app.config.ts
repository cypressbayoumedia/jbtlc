import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNgxStripe } from 'ngx-stripe';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
