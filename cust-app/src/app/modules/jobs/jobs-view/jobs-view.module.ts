import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsViewRoutingModule } from './jobs-view-routing.module';
import { JobsViewComponent } from './jobs-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobsViewComponent],
  imports: [
    CommonModule,
    JobsViewRoutingModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class JobsViewModule { }
