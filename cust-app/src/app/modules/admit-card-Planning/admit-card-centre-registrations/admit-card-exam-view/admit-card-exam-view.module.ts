import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmitCardExamViewRoutingModule } from './admit-card-exam-view-routing.module';
import { AdmitCardExamViewComponent } from './admit-card-exam-view.component';
import { AdmitCardExamViewFilterComponent } from './admit-card-exam-view-filter/admit-card-exam-view-filter.component';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';


@NgModule({
  declarations: [AdmitCardExamViewComponent, AdmitCardExamViewFilterComponent],
  imports: [
    CommonModule,
    AdmitCardExamViewRoutingModule,
    NgxIxcheckTableLibModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    FilterToggleModule
  ]
})
export class AdmitCardExamViewModule { }
