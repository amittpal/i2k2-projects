import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportantDatesRoutingModule } from './important-dates-routing.module';
import { ImportantDatesComponent } from './important-dates.component';


@NgModule({
  declarations: [ImportantDatesComponent],
  imports: [
    CommonModule,
    ImportantDatesRoutingModule
  ]
})
export class ImportantDatesModule { }
