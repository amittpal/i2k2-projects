import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionRequirementsListRoutingModule } from './question-requirements-list-routing.module';
import { QuestionRequirementsListComponent } from './question-requirements-list.component';
import { QuestionRequirementsFilterComponent } from '../question-requirements-filter/question-requirements-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import {NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';

@NgModule({
  declarations: [QuestionRequirementsListComponent, QuestionRequirementsFilterComponent],
  imports: [
    CommonModule,
    QuestionRequirementsListRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class QuestionRequirementsListModule { }
