import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { PackagingListComponent } from './packaging-list.component';
import { PackagingListRoutingModule } from './packaging-list-routing.module';
import { PackagingListFilterComponent } from './packaging-list-filter/packaging-list-filter.component';

@NgModule({
  declarations: [PackagingListComponent, PackagingListFilterComponent],
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
    PackagingListRoutingModule
  ]
})
export class PackagingListModule { }
