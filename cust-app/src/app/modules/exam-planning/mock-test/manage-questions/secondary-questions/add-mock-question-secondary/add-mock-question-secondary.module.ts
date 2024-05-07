import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMockQuestionSecondaryRoutingModule } from './add-mock-question-secondary-routing.module';
import { AddMockQuestionSecondaryComponent } from './add-mock-question-secondary.component';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MockQuestionFilterSecondaryModule } from '../mock-question-filter-secondary/mock-question-filter-secondary.module';
import { MockQuestionTypesSecondaryModule } from '../mock-question-types-secondary/mock-question-types-secondary.module';


@NgModule({
  declarations: [AddMockQuestionSecondaryComponent],
  imports: [
    CommonModule,
    AddMockQuestionSecondaryRoutingModule,    
    MenuToggleModule,
    FilterToggleModule,   
    AngularSvgIconModule,      
    MockQuestionFilterSecondaryModule,        
    MockQuestionTypesSecondaryModule   
  ]
})
export class AddMockQuestionSecondaryModule { }
