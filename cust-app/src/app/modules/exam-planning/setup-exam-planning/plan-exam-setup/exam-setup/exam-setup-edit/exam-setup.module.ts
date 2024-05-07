import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExamSetupRoutingModule } from "./exam-setup-routing.module";
import { ExamSetupComponent } from "./exam-setup.component";

import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuToggleModule } from "src/app/directives/menu-toggle/menu-toggle.module";
import { FilterToggleModule } from "src/app/directives/filter-toggle/filter-toggle.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule, TabsModule } from "ngx-bootstrap";
import { NgxIxcheckBubbleLibModule } from "ngx-ixcheck-bubble-lib";
import { NgxIxcheckTableLibModule } from "ngx-ixcheck-table-lib";
import { NgxIxcheckTableOuterPaginationLibModule } from "ngx-ixcheck-table-outer-pagination-lib";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxIxcheckTable3LibModule } from "ngx-ixcheck-table3-lib";

// import { NgxIxcheckTable4LibModule } from 'ngx-ixcheck-table4-lib';

import { NgxIxcheckProductInfoLibModule } from "src/app/components/ngx-ixcheck-product-info-new/ngx-ixcheck-product-info-new.module";

import { TwoDigitDecimalDirective } from "src/app/directives/two-digit-decimal/two-digit-decimal.directive";

//sections
import { SectionsComponent } from "../../sections/sections-edit/sections.component";

//Exam
import { ExamComponent } from "../../exam/exam-edit/exam.component";

// Question
import { QuestionsComponent } from "../../questions/questions-edit/questions.component";
import { QuestionsEditRowdetailComponent } from "../../questions/questions-edit/questions-edit-rowdetails/questions-edit-rowdetails.component";

// Final-review
import { FinalReviewComponent } from "../../final/final-review-edit/final-review.component";
import { FinalReviewRowdetailComponent } from "../../final/final-review-edit/final-review-rowdetail/final-review-rowdetail.component";
// import { FinalSecondRowdetailComponent } from '../../final/final-review-edit/final-second-rowdetail/final-second-rowdetail.component';

import { OnlyNumbersDirective } from "src/app/directives/only-numbers/only-numbers.directive";

@NgModule({
  declarations: [
    ExamSetupComponent,
    ExamComponent,
    SectionsComponent,
    QuestionsComponent,
    TwoDigitDecimalDirective,
    OnlyNumbersDirective,
    FinalReviewComponent,
    FinalReviewRowdetailComponent,
    QuestionsEditRowdetailComponent,
  ],
  imports: [
    CommonModule,
    ExamSetupRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckProductInfoLibModule,
    NgxIxcheckTable3LibModule,
    // NgxIxcheckTable4LibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgMultiSelectDropDownModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ExamSetupModule {}
