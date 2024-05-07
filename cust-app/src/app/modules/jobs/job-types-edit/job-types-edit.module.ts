import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTypesEditRoutingModule } from './job-types-edit-routing.module';
import { JobTypesEditComponent } from './job-types-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobTypesEditComponent],
  imports: [
    CommonModule,
    JobTypesEditRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class JobTypesEditModule { }
