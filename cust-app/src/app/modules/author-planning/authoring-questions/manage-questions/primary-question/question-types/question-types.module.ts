import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SingleChoiceManageComponent } from './single-choice/single-choice-manage/single-choice-manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuillModule } from 'ngx-quill';
import { ManageReferencesModule } from '../manage-references/manage-references.module';
import { AuditTrailModule } from '../../audit-trail/audit-trail.module';
import { SingleChoiceReviewComponent } from './single-choice/single-choice-review/single-choice-review.component';
import { SingleChoiceApproveComponent } from './single-choice/single-choice-approve/single-choice-approve.component';
import { MultipleChoiceManageComponent } from './multiple-choice/multiple-choice-manage/multiple-choice-manage.component';
import { MultipleChoiceReviewComponent } from './multiple-choice/multiple-choice-review/multiple-choice-review.component';
import { MultipleChoiceApproveComponent } from './multiple-choice/multiple-choice-approve/multiple-choice-approve.component';
import { TrueFalseManageComponent } from './true-false/true-false-manage/true-false-manage.component';
import { TrueFalseReviewComponent } from './true-false/true-false-review/true-false-review.component';
import { TrueFalseApproveComponent } from './true-false/true-false-approve/true-false-approve.component';
import { FillBlankManageComponent } from './fill-blank/fill-blank-manage/fill-blank-manage.component';
import { FillBlankReviewComponent } from './fill-blank/fill-blank-review/fill-blank-review.component';
import { FillBlankApproveComponent } from './fill-blank/fill-blank-approve/fill-blank-approve.component';
import { MatchManageComponent } from './match/match-manage/match-manage.component';
import { MatchReviewComponent } from './match/match-review/match-review.component';
import { MatchApproveComponent } from './match/match-approve/match-approve.component';

//register quill image resize module
import ImageResize from 'quill-image-resize';
import * as QuillNamespace from 'quill';
import { HtmlToTextModule } from 'src/app/shared/pipes/HtmlToText/html-to-text.module';
let Quill: any = QuillNamespace;
Quill.register('modules/imageResize', ImageResize);

@NgModule({
  declarations: [      
      SingleChoiceManageComponent,
      SingleChoiceReviewComponent,
      SingleChoiceApproveComponent,
      MultipleChoiceManageComponent,
      MultipleChoiceReviewComponent,
      MultipleChoiceApproveComponent,
      TrueFalseManageComponent,
      TrueFalseReviewComponent,
      TrueFalseApproveComponent,
      FillBlankManageComponent,
      FillBlankReviewComponent,
      FillBlankApproveComponent,
      MatchManageComponent,
      MatchReviewComponent,
      MatchApproveComponent      
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,        
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AngularSvgIconModule,    
    QuillModule.forRoot(),    
    ManageReferencesModule,
    AuditTrailModule,
    HtmlToTextModule    
  ],
  exports:[    
    SingleChoiceManageComponent,
    SingleChoiceReviewComponent,
    SingleChoiceApproveComponent,
    MultipleChoiceManageComponent,
    MultipleChoiceReviewComponent,
    MultipleChoiceApproveComponent,
    TrueFalseManageComponent,
    TrueFalseReviewComponent,
    TrueFalseApproveComponent,
    FillBlankManageComponent,
    FillBlankReviewComponent,
    FillBlankApproveComponent,
    MatchManageComponent,
    MatchReviewComponent,
    MatchApproveComponent
  ],
})
export class QuestionTypesModule { }
