import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutMappingRoutingModule } from './layout-mapping-routing.module';

import { LayoutMappingAddComponent } from './layout-mapping-add/layout-mapping-add.component';

import { LayoutMappingAddFilterComponent } from './layout-mapping-add/layout-mapping-add-filter/layout-mapping-add-filter.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [                
                 LayoutMappingAddComponent,                 
                 LayoutMappingAddFilterComponent
                ],
  imports: [
    CommonModule,
    LayoutMappingRoutingModule,                 
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    GridsterModule
    
  ]
})
export class LayoutMappingModule { }
