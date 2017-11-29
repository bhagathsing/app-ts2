import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule} from 'angular2-busy';
import {SelectModule} from './common/select/select.module';

import { LoginModule } from './login/login.module';
import { MyteModule } from './myte/myte.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoute } from './app.routes';
import { DataService } from './service/DataService';
import { MockDataService } from './service/MockDataService';
import { LiveDataService } from './service/LiveDataService';
import { CalendarModule } from './common/calendar/calendar.module';
import { AddAssignmentComponent } from '../app/myte/superviser-view/assignments/add-assignment/add-assignment.component';
import { ConfirmModule } from '../app/common/confirm/confirm.module';
import { ConfigSettingsComponent } from './common/config-settings/config-settings.component';
import { MultiselectDropdownModule } from './common/dropdown/dropdown.module';

@NgModule({
  declarations: [
    AppComponent,
    ConfigSettingsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoute,
    BrowserAnimationsModule,
    BusyModule,
    LoginModule,
    MyteModule,
    SelectModule,
    CalendarModule.forRoot(),
    ConfirmModule.forRoot(),
    MultiselectDropdownModule.forRoot(),
  ],
  entryComponents:[AddAssignmentComponent,ConfigSettingsComponent],
  providers: [
    { provide: DataService, useClass: LiveDataService }
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
