import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreEditRoutingModule } from './centre-edit-routing.module';
import { CentreEditComponent } from './centre-edit.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { CentreEditRowdetailsComponent } from './centre-edit-rowdetails/centre-edit-rowdetails.component';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { CentreEditDetailsComponent } from './centre-edit-details/centre-edit-details.component';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';



@NgModule({
  declarations: [CentreEditComponent, CentreEditRowdetailsComponent, CentreEditDetailsComponent],
  imports: [
    CommonModule,
    CentreEditRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
     FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTable3LibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
  
})
export class CentreEditModule { }
