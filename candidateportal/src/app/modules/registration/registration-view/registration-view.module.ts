import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationViewRoutingModule } from './registration-view-routing.module';
import { RegistrationViewComponent } from './registration-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [RegistrationViewComponent],
  imports: [
    CommonModule,
    RegistrationViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    TabsModule.forRoot(),
    GridsterModule
  ]
})
export class RegistrationViewModule { }
