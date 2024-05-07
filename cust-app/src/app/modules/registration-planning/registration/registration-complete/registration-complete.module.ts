import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationCompleteRoutingModule } from './registration-complete-routing.module';
import { RegistrationCompleteComponent } from './registration-complete.component';


@NgModule({
  declarations: [RegistrationCompleteComponent],
  imports: [
    CommonModule,
    RegistrationCompleteRoutingModule
  ]
})
export class RegistrationCompleteModule { }
