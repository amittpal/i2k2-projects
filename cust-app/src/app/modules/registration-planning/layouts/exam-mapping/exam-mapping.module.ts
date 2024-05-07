import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamMappingRoutingModule } from './exam-mapping-routing.module';
import { ExamMappingComponent } from './exam-mapping.component';
import { ExamMappingFilterComponent } from './exam-mapping-filter/exam-mapping-filter.component';
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

@NgModule({
  declarations: [ExamMappingComponent, ExamMappingFilterComponent],
  imports: [
    CommonModule,
    ExamMappingRoutingModule,
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
  ]
})
export class ExamMappingModule { }
