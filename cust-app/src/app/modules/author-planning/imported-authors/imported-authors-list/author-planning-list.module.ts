import { NgModule,NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorPlanningListRoutingModule } from './author-planning-list-routing.module';
import { AuthorPlanningListComponent } from './author-planning-list.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { ImportedAuthorsFilterComponent } from '../imported-authors-filter/imported-authors-filter.component';




@NgModule({
  declarations: [AuthorPlanningListComponent,ImportedAuthorsFilterComponent],
  imports: [
    CommonModule,
    AuthorPlanningListRoutingModule,
    CommonModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
  
    BsDropdownModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
})
export class AuthorPlanningListModule { }
