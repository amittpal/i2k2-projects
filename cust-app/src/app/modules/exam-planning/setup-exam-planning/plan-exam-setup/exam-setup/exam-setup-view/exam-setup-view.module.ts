import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamSetupViewRoutingModule } from './exam-setup-view-routing.module';
import { ExamSetupViewComponent } from './exam-setup-view.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';

import { NgxIxcheckProductInfoLibModule } from 'src/app/components/ngx-ixcheck-product-info-new/ngx-ixcheck-product-info-new.module';

// import { TwoDigitDecimalDirective } from '../../../../../directives/two-digit-decimal/two-digit-decimal.directive';

//sections
import { SectionsViewComponent } from '../../sections/sections-view/sections-view.component';

//Exam
import { ExamViewComponent } from '../../exam/exam-view/exam-view.component';

// Question
import { QuestionsViewComponent } from '../../questions/questions-view/questions-view.component';

// Final-review
import { FinalReviewViewComponent } from '../../final/final-review-view/final-review-view.component';
import { FinalReviewRowdetailViewComponent } from '../../final/final-review-view/final-review-rowdetail-view/final-review-rowdetail-view.component';

@NgModule({
  declarations: [ExamSetupViewComponent, ExamViewComponent, SectionsViewComponent, QuestionsViewComponent, FinalReviewViewComponent, FinalReviewRowdetailViewComponent],
  imports: [
    CommonModule,
    ExamSetupViewRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckProductInfoLibModule,
    NgxIxcheckTable3LibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgMultiSelectDropDownModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ExamSetupViewModule { }
