import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAdmitCardGenerateComponent } from './manage-admit-card-generate.component';
import { ManageAdmitCardGenerateListFilterComponent } from './manage-admit-card-generate-list-filter/manage-admit-card-generate-list-filter.component';
import { ManageAdmitCardGenerateRoutingModule  } from './manage-admit-card-generate.routing.module';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';

@NgModule({
  declarations: [ManageAdmitCardGenerateComponent, ManageAdmitCardGenerateListFilterComponent],
  imports: [
    CommonModule,
    ManageAdmitCardGenerateRoutingModule,
    NgxIxcheckTableLibModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    FilterToggleModule
  ]
})
export class ManageAdmitCardListModule { }
