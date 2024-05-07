import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageQuestionsRoutingModule } from './manage-questions-routing.module';
import { ManageQuestionsComponent } from './manage-questions.component';
import { ManageQuestionRowDetailsComponent } from './manage-question-row-details/manage-question-row-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ManageQuestionsFilterComponent } from './manage-questions-filter/manage-questions-filter.component';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';

@NgModule({
  declarations: [ManageQuestionsComponent, ManageQuestionRowDetailsComponent, ManageQuestionsFilterComponent],
  imports: [
    CommonModule,
    ManageQuestionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    AngularSvgIconModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    FilterToggleModule
  ]
})
export class ManageQuestionsModule { }
