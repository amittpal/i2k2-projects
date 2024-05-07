import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionFilterComponent } from './question-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
@NgModule({
  declarations: [QuestionFilterComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    FilterToggleModule
  ],
  exports:[QuestionFilterComponent]
})
export class QuestionFilterModule { }
