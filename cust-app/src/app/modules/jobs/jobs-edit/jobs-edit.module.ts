import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsEditRoutingModule } from './jobs-edit-routing.module';
import { JobsEditComponent } from './jobs-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobsEditComponent],
  imports: [
    CommonModule,
    JobsEditRoutingModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class JobsEditModule { }
