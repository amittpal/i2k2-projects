import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewQuestionRoutingModule } from './review-question-routing.module';
import { ReviewQuestionComponent } from './review-question.component';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuestionFilterModule } from '../question-filter/question-filter.module';
import { QuestionTypesModule } from '../question-types/question-types.module';


@NgModule({
  declarations: [ReviewQuestionComponent],
  imports: [
    CommonModule,
    ReviewQuestionRoutingModule,
    MenuToggleModule,
    FilterToggleModule, 
    AngularSvgIconModule,       
    QuestionFilterModule,  
    QuestionTypesModule    
  ]
})
export class ReviewQuestionModule { }
