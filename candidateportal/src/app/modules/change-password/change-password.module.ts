import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    FormControlDirective,
    FormGroupDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ChangePasswordModule { }
