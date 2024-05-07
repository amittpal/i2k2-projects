import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddQuestionRoutingModule } from './add-question-routing.module';
import { AddQuestionComponent } from './add-question.component';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuestionFilterModule } from '../question-filter/question-filter.module';

import { QuestionTypesSecondaryModule } from '../question-types-secondary/question-types-secondary.module';
@NgModule({
  declarations: [AddQuestionComponent],
  imports: [
    CommonModule,
    AddQuestionRoutingModule,  
    MenuToggleModule,
    FilterToggleModule,   
    AngularSvgIconModule,      
    QuestionFilterModule,        
    QuestionTypesSecondaryModule     
  ]
})
export class AddQuestionModule { }
