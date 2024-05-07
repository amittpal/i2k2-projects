import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
