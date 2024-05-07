import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { RegistrationAddComponent } from './registration-add.component';
import { IxcheckLibComponentsModule } from '../../layouts/ixcheck-lib-components.module';
import { RegistrationAddRoutingModule } from './registration-add-routing.module';


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
  ]
})
export class RegistrationAddModule { }
