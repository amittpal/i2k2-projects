import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { AdmitCardGenerateListComponent } from './admit-card-generate-list.component';
import { AdmitCardGenerateListFilterComponent } from './admit-card-generate-list-filter/admit-card-generate-list-filter.component';
import { AdmitCardGenerateListRoutingModule } from './admit-card-generate-list-routing.module'
import { BsDropdownModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [AdmitCardGenerateListComponent, AdmitCardGenerateListFilterComponent],
  imports: [
     CommonModule,
     AdmitCardGenerateListRoutingModule,
     AngularSvgIconModule,
     MenuToggleModule,
     FilterToggleModule,
     FormsModule,
     ReactiveFormsModule,
     NgxIxcheckTableLibModule,
     NgxIxcheckBubbleLibModule,
     NgxIxcheckTableOuterPaginationLibModule,
     BsDropdownModule.forRoot()
  ]
})
export class AdmitCardGenerateListModule { }
