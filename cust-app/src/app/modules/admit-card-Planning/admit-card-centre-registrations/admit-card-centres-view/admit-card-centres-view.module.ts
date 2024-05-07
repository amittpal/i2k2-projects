import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmitCardCentresViewRoutingModule } from './admit-card-centres-view-routing.module';
import { AdmitCardCentresViewComponent } from './admit-card-centres-view.component';
import { AdmitCardCentresViewFilterComponent } from './admit-card-centres-view-filter/admit-card-centres-view-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NetworkgroupDetailsComponent } from './networkgroup-details/networkgroup-details.component';

@NgModule({
  declarations: [AdmitCardCentresViewComponent, AdmitCardCentresViewFilterComponent, NetworkgroupDetailsComponent],
  imports: [
    CommonModule,
    AdmitCardCentresViewRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AdmitCardCentresViewModule { }
