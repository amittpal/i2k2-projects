import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisteredCandidatesRoutingModule } from './registered-candidates-routing.module';
import { RegisteredCandidatesComponent } from './registered-candidates.component';
import { RegisteredCandidatesFilterComponent } from './registered-candidates-filter/registered-candidates-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';


@NgModule({
  declarations: [RegisteredCandidatesComponent, RegisteredCandidatesFilterComponent, CandidateDetailComponent],
  imports: [
    CommonModule,
    RegisteredCandidatesRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,    
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
  ]
})
export class RegisteredCandidatesModule { }
