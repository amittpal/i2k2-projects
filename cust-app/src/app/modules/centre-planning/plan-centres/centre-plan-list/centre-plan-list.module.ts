import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentrePlanListRoutingModule } from './centre-plan-list-routing.module';
import { CentrePlanListComponent } from './centre-plan-list.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { CentrePlanFilterComponent } from '../centre-plan-filter/centre-plan-filter.component';
import { SnapshotAddComponent } from './snapshot-add/snapshot-add.component';


@NgModule({
  declarations: [CentrePlanListComponent,CentrePlanFilterComponent, SnapshotAddComponent],
  imports: [
    CommonModule,
    CentrePlanListRoutingModule,
    CommonModule,
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
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class CentrePlanListModule { }
