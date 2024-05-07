import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmitCardCentreRegistrationsRoutingModule } from './admit-card-centre-registrations-routing.module';
import { AdmitCardCentreRegistrationsComponent } from './admit-card-centre-registrations.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AdmitCardCentreRegistrationsFilterComponent } from './admit-card-centre-registrations-filter/admit-card-centre-registrations-filter.component';



@NgModule({
  declarations: [AdmitCardCentreRegistrationsComponent,AdmitCardCentreRegistrationsFilterComponent],
  imports: [
    CommonModule,
    AdmitCardCentreRegistrationsRoutingModule,
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
export class AdmitCardCentreRegistrationsModule { }
