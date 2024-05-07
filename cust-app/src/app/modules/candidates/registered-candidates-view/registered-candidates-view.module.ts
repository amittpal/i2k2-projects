import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisteredCandidatesViewRoutingModule } from './registered-candidates-view-routing.module';
import { RegisteredCandidatesViewComponent } from './registered-candidates-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from './../../../directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from './../../registration-planning/layouts/ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [RegisteredCandidatesViewComponent],
  imports: [
    CommonModule,
    RegisteredCandidatesViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    TabsModule.forRoot(),
    GridsterModule
  ]
})
export class RegisteredCandidatesViewModule { }
