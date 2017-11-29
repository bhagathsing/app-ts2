import {RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './myte/dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
  {path: '',  redirectTo: '/app/superviser/record', pathMatch: 'full' },
  {path:'**',component:NotFoundComponent}
];
export const AppRoute = RouterModule.forRoot( appRoutes,{useHash:true} )