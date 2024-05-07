import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationsSetupListRoutingModule } from './registrations-setup-list-routing.module';
import { RegistrationsSetupListComponent } from './registrations-setup-list.component';
import { RegistrationsSetupFilterComponent } from './registrations-setup-filter/registrations-setup-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import {NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';

@NgModule({
  declarations: [RegistrationsSetupListComponent, RegistrationsSetupFilterComponent],
  imports: [
    CommonModule,
    RegistrationsSetupListRoutingModule,
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
export class RegistrationsSetupListModule { }
