import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTypesAddRoutingModule } from './job-types-add-routing.module';
import { JobTypesAddComponent } from './job-types-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobTypesAddComponent],
  imports: [
    CommonModule,
    JobTypesAddRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class JobTypesAddModule { }
