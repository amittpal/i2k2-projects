import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationEditRoutingModule } from './registration-edit-routing.module';
import { RegistrationEditComponent } from './registration-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [RegistrationEditComponent],
  imports: [
    CommonModule,
    RegistrationEditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    TabsModule.forRoot(),
    GridsterModule
  ]
})
export class RegistrationEditModule { }
