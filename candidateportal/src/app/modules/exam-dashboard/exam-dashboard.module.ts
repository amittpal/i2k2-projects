import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

import { ExamDashboardRoutingModule } from './exam-dashboard-routing.module';
import { ExamDashboardComponent } from './exam-dashboard.component';

import { SingleChoiceComponent } from './answer-type/single-choice/single-choice.component';
import { MultipleChoiceComponent } from './answer-type/multiple-choice/multiple-choice.component';
import { TrueFalseComponent } from './answer-type/true-false/true-false.component';
import { FillBlankComponent } from './answer-type/fill-blank/fill-blank.component';
import { MatchComponent } from './answer-type/match/match.component';
import { SanitizeHtmlPipe } from 'src/app/exam-shared/pipes/sanitize-html/sanitize-html.pipe';
import { SubjectiveComponent } from './answer-type/subjective/subjective.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HtmlToTextPipe } from 'src/app/exam-shared/pipes/html-to-text/html-to-text.pipe';

import ImageResize from 'quill-image-resize';
import * as QuillNamespace from 'quill';
import { QuestionComponent } from './question/question.component';
import { QuestionsStatusSummaryComponent } from './questions-status-summary/questions-status-summary.component';
import { AnswersSummaryComponent } from './answers-summary/answers-summary.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FullQuestionViewComponent } from './full-question-view/full-question-view.component';
import { ExamTypeStatusModule } from '../layout/exam-type-status/exam-type-status.module';



let Quill: any = QuillNamespace;
Quill.register('modules/imageResize', ImageResize);

@NgModule({
  declarations: [
    ExamDashboardComponent,
    SingleChoiceComponent,
    MultipleChoiceComponent,
    TrueFalseComponent,
    FillBlankComponent,
    MatchComponent,
    SanitizeHtmlPipe,
    HtmlToTextPipe,
    SubjectiveComponent,
    QuestionComponent,
    QuestionsStatusSummaryComponent,
    AnswersSummaryComponent,
    FullQuestionViewComponent    
  ],
  imports: [
    CommonModule,
    ExamDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    QuillModule.forRoot(),
    ExamTypeStatusModule           
  ]
})
export class ExamDashboardModule { }
