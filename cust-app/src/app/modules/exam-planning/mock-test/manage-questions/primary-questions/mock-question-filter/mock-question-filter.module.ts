import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MockQuestionFilterRoutingModule } from './mock-question-filter-routing.module';
import { MockQuestionFilterComponent } from './mock-question-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';


@NgModule({
  declarations: [MockQuestionFilterComponent],
  imports: [
    CommonModule,
    MockQuestionFilterRoutingModule,
    AngularSvgIconModule,
    FilterToggleModule
  ],
  exports:[MockQuestionFilterComponent]
})
export class MockQuestionFilterModule { }
