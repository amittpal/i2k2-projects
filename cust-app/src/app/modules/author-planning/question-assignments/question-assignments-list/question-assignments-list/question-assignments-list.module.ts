import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionAssignmentsListRoutingModule } from './question-assignments-routing.module';
import { QuestionAssignmentsListComponent } from './question-assignments-list.component';
import { QuestionAssignmentsFilterComponent } from '../../question-assignments-filter/question-assignments-filter.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';

@NgModule({
  declarations: [QuestionAssignmentsListComponent, QuestionAssignmentsFilterComponent],
  imports: [
    CommonModule,
    QuestionAssignmentsListRoutingModule,

    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ]
})
export class QuestionAssignmentListModule { }
