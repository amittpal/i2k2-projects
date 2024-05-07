import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsAddRoutingModule } from './jobs-add-routing.module';
import { JobsAddComponent } from './jobs-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobsAddComponent],
  imports: [
    CommonModule,
    JobsAddRoutingModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class JobsAddModule { }
