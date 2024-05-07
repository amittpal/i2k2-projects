import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmitCardExamListRoutingModule } from './admit-card-exam-list-routing.module';
import { AdmitCardExamListComponent } from './admit-card-exam-list.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AdmitCardExamListFilterComponent } from './admit-card-exam-list-filter/admit-card-exam-list-filter.component';



@NgModule({
  declarations: [AdmitCardExamListComponent, AdmitCardExamListFilterComponent],
  imports: [
    CommonModule,
    AdmitCardExamListRoutingModule,
    CommonModule,           
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),    
   
  ]
})
export class AdmitCardExamListModule { }
