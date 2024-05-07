import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishExamListComponent } from './publish-exam-list.component';
import { PublishExamListFilterComponent } from './publish-exam-list-filter/publish-exam-list-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { PubishExamListRoutingModule } from './publish-exam-list-routing.module';

@NgModule({
  declarations: [PublishExamListComponent, PublishExamListFilterComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),    
    PubishExamListRoutingModule
  ]
})
export class PublishExamListModule { }
