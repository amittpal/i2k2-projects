import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveQuestionRoutingModule } from './approve-question-routing.module';
import { ApproveQuestionComponent } from './approve-question.component';

import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuestionFilterModule } from '../question-filter/question-filter.module';
import { QuestionTypesSecondaryModule } from '../question-types-secondary/question-types-secondary.module';



@NgModule({
  declarations: [ApproveQuestionComponent],
  imports: [
    CommonModule,
    ApproveQuestionRoutingModule,    
    MenuToggleModule,
    FilterToggleModule,    
    AngularSvgIconModule,        
    QuestionFilterModule,
    QuestionTypesSecondaryModule    
  ]
})
export class ApproveQuestionModule { }
