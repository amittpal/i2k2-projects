import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './userprofile-edit/userprofile-edit.component';

import { UserEditRoutingModule } from './userprofile-edit-routing.module';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
@NgModule({
  declarations: [UserEditComponent],
  imports: [
    CommonModule,
    UserEditRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),

  ],
  providers: [
    FormControlDirective,
    FormGroupDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class UserprofileModule { }
