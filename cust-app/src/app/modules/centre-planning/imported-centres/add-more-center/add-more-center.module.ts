import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMoreCenterRoutingModule } from './add-more-center-routing.module';
import { AddMoreCenterComponent } from './add-more-center.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { AddMoreCentresFilterComponent } from './center/centres-filter/centres-filter.component';
import { AddMoreCityComponent } from './city/city.component';
import { AddMoreCityFilterComponent } from './city/city-filter/city-filter.component';
import { AddMoreCentresComponent } from './center/centres.component';
import { AddMoreStateComponent } from './state/state.component';
import { AddMoreStateFilterComponent } from './state/state-filter/state-filter.component';


@NgModule({
  declarations: [AddMoreCenterComponent,
    AddMoreStateComponent,
    AddMoreStateFilterComponent,
    AddMoreCenterComponent,
    AddMoreCentresComponent,
    AddMoreCentresFilterComponent,
    AddMoreCityComponent,
    AddMoreCityFilterComponent
    ],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    AddMoreCenterRoutingModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
})
export class AddMoreCenterModule { }
