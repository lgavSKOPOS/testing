// import  enableProdMode  from '@angular/core';
import 'zone.js/dist/zone';
import 'core-js/es5/index';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
// Note: Polyfill entry point
// import '@babel/polyfill';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppModule } from './app/app.module.js';
import { environment } from './environments/environment.js';

// if (environment.production) {
//   enableProdMode();
// }

platformBrowserDynamic().bootstrapModule(AppModule);
