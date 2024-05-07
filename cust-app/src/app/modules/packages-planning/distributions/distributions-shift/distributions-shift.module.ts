import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributionsShiftRoutingModule } from './distributions-shift-routing.module';
import { DistributionsShiftComponent } from './distributions-shift.component';


@NgModule({
  declarations: [DistributionsShiftComponent],
  imports: [
    CommonModule,
    DistributionsShiftRoutingModule
  ]
})
export class DistributionsShiftModule { }
