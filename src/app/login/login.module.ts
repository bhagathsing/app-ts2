import { NgModule  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BusyModule } from 'angular2-busy';
import { AuthGuard } from '../service//auth-guard.service';
import { LoginComponent } from './login.component';

import { ConfirmModule } from '../../app/common/confirm/confirm.module';
const routes:Routes =[
    {path:'login',component:LoginComponent},
    {path:'',redirectTo:'/login',pathMatch:'full'},
];
@NgModule({
    imports: [
        CommonModule,
        ConfirmModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        BrowserAnimationsModule,
        BusyModule
    ],
    declarations: [
        LoginComponent
    ]
   
})
export class LoginModule {

}
