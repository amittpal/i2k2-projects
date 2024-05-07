import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmitCardRegistrationsRoutingModule } from './admit-card-registrations-routing.module';
import { AdmitCardRegistrationsComponent } from './admit-card-registrations.component';
import { AdmitCardRegistrationsFilterComponent } from './admit-card-registrations-filter/admit-card-registrations-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [AdmitCardRegistrationsComponent, AdmitCardRegistrationsFilterComponent],
  imports: [
    CommonModule,
    AdmitCardRegistrationsRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AdmitCardRegistrationsModule { }
