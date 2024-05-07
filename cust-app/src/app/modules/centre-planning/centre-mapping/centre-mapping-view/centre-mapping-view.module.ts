import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreMappingViewRoutingModule } from './centre-mapping-view-routing.module';
import { CentreMappingViewComponent } from './centre-mapping-view.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { CentreMappingViewDetailsComponent } from './centre-mapping-view-details/centre-mapping-view-details.component';



@NgModule({
  declarations: [CentreMappingViewComponent, CentreMappingViewDetailsComponent],
  imports: [
    CommonModule,
    CentreMappingViewRoutingModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    FormsModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
})
export class CentreMappingViewModule { }
