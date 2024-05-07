import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';

import { QuestionAssignmentsListRoutingModule } from './assign-questions-routing.module'
import { AssignQuestionsComponent } from './assign-questions.component'

import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { AssignQuestionsRowdetailComponent } from './assign-questions-rowdetails/assign-questions-rowdetails.component';

@NgModule({
  declarations: [AssignQuestionsComponent, AssignQuestionsRowdetailComponent],
  imports: [
    CommonModule,
    QuestionAssignmentsListRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTable3LibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ]
})
export class AssignQuestionModule { }
