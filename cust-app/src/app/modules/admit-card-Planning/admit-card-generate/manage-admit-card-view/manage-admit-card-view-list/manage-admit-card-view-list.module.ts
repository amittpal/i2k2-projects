import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAdmitCardViewListRoutingModule } from './manage-admit-card-view-list-routing.module';
import { ManageAdmitCardViewListComponent } from './manage-admit-card-view-list.component'
import { ManageAdmitCardViewListFilterComponent } from './manage-admit-card-view-list-filter/manage-admit-card-view-list-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ManageAdmitCardViewListRowdetailComponent } from './manage-admit-card-view-list-rowdetail/manage-admit-card-view-list-rowdetail.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [ManageAdmitCardViewListComponent,ManageAdmitCardViewListFilterComponent, ManageAdmitCardViewListRowdetailComponent],
  imports: [
    CommonModule,
    ManageAdmitCardViewListRoutingModule,    
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ManageAdmitCardViewListModule { }
