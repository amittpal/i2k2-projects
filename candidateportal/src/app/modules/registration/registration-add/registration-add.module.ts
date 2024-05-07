import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationAddRoutingModule } from './registration-add-routing.module';
import { RegistrationAddComponent } from './registration-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [RegistrationAddComponent],
  imports: [
    CommonModule,
    RegistrationAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    TabsModule.forRoot(),
    GridsterModule
  ]
})
export class RegistrationAddModule { }
