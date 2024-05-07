import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationImportRoutingModule } from './registration-import-routing.module';
import { RegistrationImportComponent } from './registration-import.component';
import { RegistrationImportFilterComponent } from './registration-import-filter/registration-import-filter.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RegistrationImportDetailComponent } from './registration-import-detail/registration-import-detail.component';


@NgModule({
  declarations: [RegistrationImportComponent, RegistrationImportFilterComponent, RegistrationImportDetailComponent],
  imports: [
    CommonModule,
    RegistrationImportRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,    
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RegistrationImportModule { }
