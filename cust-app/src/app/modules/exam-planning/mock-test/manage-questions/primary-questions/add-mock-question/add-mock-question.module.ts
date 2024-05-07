import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMockQuestionRoutingModule } from './add-mock-question-routing.module';
import { AddMockQuestionComponent } from './add-mock-question.component';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MockQuestionFilterModule } from '../mock-question-filter/mock-question-filter.module';
import { MockQuestionTypesModule } from '../mock-question-types/mock-question-types.module';


@NgModule({
  declarations: [AddMockQuestionComponent],
  imports: [
    CommonModule,
    AddMockQuestionRoutingModule,
    MenuToggleModule,
    FilterToggleModule, 
    AngularSvgIconModule,       
    MockQuestionFilterModule,  
    MockQuestionTypesModule 
  ]
})
export class AddMockQuestionModule { }
