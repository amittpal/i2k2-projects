import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagingShiftComponent } from './packaging-shift.component';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { PackagingShiftRoutingModule } from './packaging-shift-routing.module';

@NgModule({
  declarations: [PackagingShiftComponent],
  imports: [
    CommonModule,
    NgxIxcheckTableLibModule,
    PackagingShiftRoutingModule
  ]
})
export class PackagingShiftModule { }
