import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationsDataRoutingModule } from './registrations-data-routing.module';
import { RegistrationsDataComponent } from './registrations-data.component';


@NgModule({
  declarations: [RegistrationsDataComponent],
  imports: [
    CommonModule,
    RegistrationsDataRoutingModule
  ]
})
export class RegistrationsDataModule { }
