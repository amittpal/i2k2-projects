import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanExamsListRoutingModule } from './plan-exams-list-routing.module';
import { PlanExamsListComponent } from './plan-exams-list.component';
import { PlanExamsFilterComponent } from '../plan-exams-filter/plan-exams-filter.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';

import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';



@NgModule({
  declarations: [PlanExamsListComponent, PlanExamsFilterComponent],
  imports: [
    CommonModule,
    PlanExamsListRoutingModule,
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
export class PlanExamsListModule { }
