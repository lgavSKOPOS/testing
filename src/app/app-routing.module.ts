import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {Route, RouterModule, Routes} from '@angular/router';
import { MainComponent} from './main/main.component';

const routes: Routes = [
  { path: 'main', component: MainComponent }
];
@NgModule({
  declarations: [],
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})


export class AppRoutingModule { }
