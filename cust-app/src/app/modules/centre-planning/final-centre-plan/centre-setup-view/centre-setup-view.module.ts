import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentreSetupViewRoutingModule } from './centre-setup-view-routing.module';
import { CentreMainComponent } from './centre-main/centre-main.component';

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

import { ExamComponent } from './exam/exam.component';
import { ShiftComponent } from './shift/shift.component';
import { ShiftRowdetailComponent } from './shift/shift-rowdetails/shift-rowdetails.component';

import { RegDataComponent } from './regdata/regdata.component';

import { AssignPrefAComponent } from './assign-pref-1/assign-pref-1.component';
import { FirstTabRowdetailComponent } from './assign-pref-1/first-tab-rowdetail/first-tab-rowdetail.component';
import { SecondTabRowdetailComponent } from './assign-pref-1/table-list-rowdetail/second-tab-rowdetail/second-tab-rowdetail.component';
import { TableListRowdetailComponent } from './assign-pref-1/table-list-rowdetail/table-list-rowdetail.component';

import { AssignPrefBComponent } from './assign-pref-2/assign-pref-2.component';
import { FirstTabBRowdetailComponent } from './assign-pref-2/first-tab-b-rowdetail/first-tab-b-rowdetail.component';
import { SecondTabBRowdetailComponent } from './assign-pref-2/table-list-b-rowdetail/second-tab-b-rowdetail/second-tab-b-rowdetail.component';
import { TableListBRowdetailComponent } from './assign-pref-2/table-list-b-rowdetail/table-list-b-rowdetail.component';

import { AssignPrefCComponent } from './assign-pref-3/assign-pref-3.component';
import { FirstTabCRowdetailComponent } from './assign-pref-3/first-tab-c-rowdetail/first-tab-c-rowdetail.component';
import { SecondTabCRowdetailComponent } from './assign-pref-3/table-list-c-rowdetail/second-tab-c-rowdetail/second-tab-c-rowdetail.component';
import { TableListCRowdetailComponent } from './assign-pref-3/table-list-c-rowdetail/table-list-c-rowdetail.component';

import { FinalViewComponent } from './final-view/final-view.component';
import { CenterAllocationReportComponent } from './center-allocation-report/center-allocation-report.component';
import { NgxIxcheckReportsViewerModule } from './../../../../../app/components/ngx-ixcheck-reports-viewer/ngx-ixcheck-reports-viewer.module';
import { CentreListComponent } from './centre-list/centre-list.component';
import { CentreEditRowdetailsComponent } from './centre-list/centre-edit-rowdetails/centre-edit-rowdetails.component';
import { CentreListFilterComponent } from './centre-list/centre-list-filter/centre-list-filter.component';
import { CentreListAddComponent } from './centre-list/centre-list-add/centre-list-add.component';
import { CentreListEditComponent } from './centre-list/centre-list-edit/centre-list-edit.component';
import { AllocateComponent } from './allocate/allocate.component'

@NgModule({
  declarations: [
    TableListRowdetailComponent,
    FirstTabRowdetailComponent,
    CentreMainComponent,
    ExamComponent,
    ShiftRowdetailComponent,
    ShiftComponent,
    RegDataComponent,
    SecondTabRowdetailComponent,
    AssignPrefAComponent,
    FinalViewComponent,

    AssignPrefBComponent,
    FirstTabBRowdetailComponent,
    SecondTabBRowdetailComponent,
    TableListBRowdetailComponent,

    AssignPrefCComponent,
    FirstTabCRowdetailComponent,
    SecondTabCRowdetailComponent,
    TableListCRowdetailComponent,
    CenterAllocationReportComponent,
    CentreListComponent,
    CentreEditRowdetailsComponent,
    CentreListFilterComponent,
    CentreListAddComponent,
    CentreListEditComponent,
    AllocateComponent,

  ],
  imports: [
    CommonModule,
    CentreSetupViewRoutingModule,
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
export class CentreSetupViewModule { }
