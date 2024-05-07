import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisteredExamRoutingModule } from './registered-exam-routing.module';
import { RegisteredExamComponent } from './registered-exam.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { TabsModule, BsDropdownModule } from 'ngx-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';
import { EligibilityQualificationComponent } from './eligibility-qualification/eligibility-qualification.component';
import { QualificationRowdetailComponent } from './eligibility-qualification/qualification-rowdetail/qualification-rowdetail.component';


@NgModule({
  declarations: [RegisteredExamComponent, ActivityLogsComponent, EligibilityQualificationComponent, QualificationRowdetailComponent],
  imports: [
    CommonModule,
    RegisteredExamRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,    
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
  ]
})
export class RegisteredExamModule { }