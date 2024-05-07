import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRegistrationsRoutingModule } from './candidate-registrations-routing.module';
import { CandidateRegistrationsComponent } from './candidate-registrations.component';
import { CandidateRegistrationsFilterComponent } from './candidate-registrations-filter/candidate-registrations-filter.component';
import { CandidateRegistrationsDetailComponent } from './candidate-registrations-detail/candidate-registrations-detail.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [CandidateRegistrationsComponent, CandidateRegistrationsFilterComponent, CandidateRegistrationsDetailComponent],
  imports: [
    CommonModule,
    CandidateRegistrationsRoutingModule,
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
export class CandidateRegistrationsModule { }
