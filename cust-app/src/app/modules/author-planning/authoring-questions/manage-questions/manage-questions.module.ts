import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageQuestionsRoutingModule } from './manage-questions-routing.module';
import { ManageQuestionsComponent } from './manage-questions.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ManageQuestionRowDetailsComponent } from './manage-question-row-details/manage-question-row-details.component';


@NgModule({
  declarations: [ManageQuestionsComponent, ManageQuestionRowDetailsComponent],
  imports: [
    CommonModule,
    ManageQuestionsRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ]
})
export class ManageQuestionsModule { }
