import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutListRoutingModule } from './layout-list-routing.module';
import { LayoutListComponent } from './layout-list.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { LayoutListFilterComponent } from './layout-list-filter/layout-list-filter.component';



@NgModule({
  declarations: [LayoutListComponent,LayoutListFilterComponent],
  imports: [
    CommonModule,
    LayoutListRoutingModule,            
     AngularSvgIconModule,
     MenuToggleModule,
     FilterToggleModule,
     FormsModule,
     ReactiveFormsModule,
     NgxIxcheckTableLibModule,
     NgxIxcheckBubbleLibModule,
     NgxIxcheckTableOuterPaginationLibModule
  ]
})
export class LayoutListModule { }
