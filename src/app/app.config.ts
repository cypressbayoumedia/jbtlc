import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNgxStripe } from 'ngx-stripe';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Firebase Config (User needs to replace this)
const firebaseConfig = {
apiKey: "AIzaSyCv8qme4V_c2Py3Fwa6qYlq497OmXZ_N7c",
authDomain: "tropical-leaf-corner.firebaseapp.com",
projectId: "tropical-leaf-corner",
storageBucket: "tropical-leaf-corner.firebasestorage.app",
messagingSenderId: "641472402505",
appId: "1:641472402505:web:2850ffed12b53b8e711b98"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgxStripe('pk_test_51SuAccCfpoAwBajMO8Zwawry8O0OSwiYA9F2wJkZkoB1X76niRp5RubJBDilPnVYpyDUnFKPzAh8ByrL0hqX4A9Q00GTXBiLlM'), // Re-adding as it wasn't visible in view_file earlier but likely needed

    // Firebase Providers
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
  ]
};
