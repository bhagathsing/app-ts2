import { NgModule,CUSTOM_ELEMENTS_SCHEMA,ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm.component';

@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports:[ConfirmComponent]
})
export class ConfirmModule { 
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: ConfirmModule
        };
      }
}
