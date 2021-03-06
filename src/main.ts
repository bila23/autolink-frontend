import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

/* ## */
localStorage.setItem('API', 'http://34.67.215.71:8014/autolink/');
//localStorage.setItem('API', 'http://localhost:8014/autolink/');
/* ## */