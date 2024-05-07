import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { MapCentresRoutingModule } from './map-centres-routing.module';
import { MapCentresComponent } from './map-centres.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { MapCentresFilterComponent } from '../map-centres-filter/map-centres-filter.component';
import { MapCentresDetailsComponent } from './map-centres-details/map-centres-details.component';


@NgModule({
  declarations: [MapCentresComponent,MapCentresFilterComponent, MapCentresDetailsComponent],
  imports: [
    CommonModule,
    MapCentresRoutingModule,
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
    BsDropdownModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
})
export class MapCentresModule { }
