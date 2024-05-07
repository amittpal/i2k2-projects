import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockQuestionFilterSecondaryComponent } from './mock-question-filter-secondary.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';


@NgModule({
  declarations: [MockQuestionFilterSecondaryComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    FilterToggleModule

  ],
  exports:[MockQuestionFilterSecondaryComponent]
})
export class MockQuestionFilterSecondaryModule { }
