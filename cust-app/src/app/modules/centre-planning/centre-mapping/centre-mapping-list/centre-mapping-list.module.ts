import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { CentreMappingListRoutingModule } from './centre-mapping-list-routing.module';
import { CentreMappingListComponent } from './centre-mapping-list.component';
import { CentreMappingListFilterComponent } from '../centre-mapping-list-filter/centre-mapping-list-filter.component';


@NgModule({
  declarations: [CentreMappingListComponent,CentreMappingListFilterComponent],
  imports: [
    CommonModule,
    CentreMappingListRoutingModule,
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
export class CentreMappingListModule { }
