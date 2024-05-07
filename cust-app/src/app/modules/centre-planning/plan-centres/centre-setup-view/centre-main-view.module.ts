import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentreMainListViewRoutingModule } from './centre-main-list-view-routing.module';
import { CentreMainViewComponent } from './centre-main-view/centre-main-view.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { NgxIxcheckTable4LibModule } from 'ngx-ixcheck-table4-lib';

import { ExamViewComponent } from './exam-view/exam-view.component';
import { ShiftViewComponent } from './shift-view/shift-view.component';
// import { ShiftRowdetailViewComponent } from './shift-view/shift-rowdetails-view/shift-rowdetails-view.component';

import { RegDataViewComponent } from './regdata-view/regdata-view.component';

import { AssignPrefAViewComponent } from './assign-pref-1-view/assign-pref-1-view.component';
// import { FirstTabRowdetailViewComponent } from './assign-pref-1-view/first-tab-rowdetail-view/first-tab-rowdetail-view.component';
// import { SecondTabRowdetailViewComponent } from './assign-pref-1-view/table-list-rowdetail-view/second-tab-rowdetail-view/second-tab-rowdetail-view.component';
import { TableListRowdetailViewComponent } from './assign-pref-1-view/table-list-rowdetail-view/table-list-rowdetail-view.component';

import { AssignPrefBViewComponent } from './assign-pref-2-view/assign-pref-2-view.component';
// import { FirstTabBRowdetailViewComponent } from './assign-pref-2-view/first-tab-b-rowdetail-view/first-tab-b-rowdetail-view.component';
// import { SecondTabBRowdetailViewComponent } from './assign-pref-2-view/table-list-b-rowdetail-view/second-tab-b-rowdetail-view/second-tab-b-rowdetail-view.component';
import { TableListBRowdetailViewComponent } from './assign-pref-2-view/table-list-b-rowdetail-view/table-list-b-rowdetail-view.component';

import { AssignPrefCViewComponent } from './assign-pref-3-view/assign-pref-3-view.component';
// import { FirstTabCRowdetailViewComponent } from './assign-pref-3-view/first-tab-c-rowdetail-view/first-tab-c-rowdetail-view.component';
// import { SecondTabCRowdetailViewComponent } from './assign-pref-3-view/table-list-c-rowdetail-view/second-tab-c-rowdetail-view/second-tab-c-rowdetail-view.component';
import { TableListCRowdetailViewComponent } from './assign-pref-3-view/table-list-c-rowdetail-view/table-list-c-rowdetail-view.component';

import { FinalViewOnlyComponent } from './final-view-view/final-view.component';
import { CenterAllocationReportViewComponent } from './center-allocation-report-view/center-allocation-report-view.component';
import { NgxIxcheckReportsViewerModule } from './../../../../../app/components/ngx-ixcheck-reports-viewer/ngx-ixcheck-reports-viewer.module'
import { CentreListViewComponent } from './centre-list-view/centre-list-view.component';
import { CentreEditRowdetailsViewComponent } from './centre-list-view/centre-edit-rowdetails-view/centre-edit-rowdetails-view.component';
import { CentreListFilterViewComponent } from './centre-list-view/centre-list-filter-view/centre-list-filter-view.component'

@NgModule({
  declarations: [
    TableListRowdetailViewComponent,
    // FirstTabRowdetailViewComponent,
    CentreMainViewComponent,
    ExamViewComponent,
    // ShiftRowdetailViewComponent,
    ShiftViewComponent,
    RegDataViewComponent,
    // SecondTabRowdetailViewComponent,
    AssignPrefAViewComponent,
    FinalViewOnlyComponent,

    AssignPrefBViewComponent,
    // FirstTabBRowdetailViewComponent,
    // SecondTabBRowdetailViewComponent,
    TableListBRowdetailViewComponent,

    AssignPrefCViewComponent,
    // FirstTabCRowdetailViewComponent,
    // SecondTabCRowdetailViewComponent,
    TableListCRowdetailViewComponent,
    CenterAllocationReportViewComponent,
    CentreListViewComponent,
    CentreEditRowdetailsViewComponent,
    CentreListFilterViewComponent
  ],
  imports: [
    CommonModule,
    CentreMainListViewRoutingModule,

    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgMultiSelectDropDownModule,
    NgxIxcheckTable3LibModule,
    NgxIxcheckTable4LibModule,
    NgxIxcheckReportsViewerModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class CentreMainViewModule { }
