import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTypesViewRoutingModule } from './job-types-view-routing.module';
import { JobTypesViewComponent } from './job-types-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobTypesViewComponent],
  imports: [
    CommonModule,
    JobTypesViewRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class JobTypesViewModule { }
