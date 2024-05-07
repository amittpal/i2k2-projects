import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsListRoutingModule } from './questions-list-routing.module';
import { QuestionsListComponent } from './questions-list.component';
import { QuestionsListFilterComponent } from './questions-list-filter/questions-list-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [QuestionsListComponent, QuestionsListFilterComponent],
  imports: [
    CommonModule,
    QuestionsListRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ]
})
export class QuestionsListModule { }
