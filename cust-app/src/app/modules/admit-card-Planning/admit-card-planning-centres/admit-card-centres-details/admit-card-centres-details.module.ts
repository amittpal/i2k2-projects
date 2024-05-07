import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmitCardCentresDetailsRoutingModule } from './admit-card-centres-details-routing.module';
import { AdmitCardCentresDetailsComponent } from './admit-card-centres-details.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib'
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';




@NgModule({
  declarations: [AdmitCardCentresDetailsComponent],
  imports: [
    CommonModule,
    AdmitCardCentresDetailsRoutingModule,
    CommonModule,
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
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
  
})
export class AdmitCardCentresDetailsModule { }
