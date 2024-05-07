import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportCentreRoutingModule } from './import-centre-routing.module';
import { ImportCentreComponent } from './import-centre.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule,TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { StateComponent } from '../state/state.component';
import { CityComponent } from '../city/city.component';
import { CentresComponent } from '../centres/centres.component';
import { CityFilterComponent } from '../city-filter/city-filter.component';
import { StateFilterComponent } from '../state-filter/state-filter.component';
import { CentresFilterComponent } from '../centres-filter/centres-filter.component';



@NgModule({
  declarations: [ImportCentreComponent,StateComponent,CityComponent,CentresComponent,CityFilterComponent,StateFilterComponent,CentresFilterComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    ImportCentreRoutingModule,
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
export class ImportCentreModule { }
