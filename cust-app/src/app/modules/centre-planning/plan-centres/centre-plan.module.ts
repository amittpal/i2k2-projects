import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentrePlanRoutingModule } from './centre-plan-routing.module';
import { CentrePlanFilterComponent } from './centre-plan-filter/centre-plan-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CentrePlanRoutingModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CentrePlanModule { }
