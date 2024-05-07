import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionRequirementsManageRoutingModule } from './question-requirements-manage-routing.module';
import { QuestionRequirementsManageComponent } from './question-requirements-manage.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { FormsModule, ReactiveFormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';

@NgModule({
  declarations: [QuestionRequirementsManageComponent],
  imports: [
    CommonModule,
    QuestionRequirementsManageRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    NgxIxcheckTableLibModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    FormControlDirective,
    FormGroupDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class QuestionRequirementsManageModule { }
