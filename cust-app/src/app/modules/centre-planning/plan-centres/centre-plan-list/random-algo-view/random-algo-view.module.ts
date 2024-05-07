import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RandomAlgoViewRoutingModule } from './random-algo-view-routing.module';
import { RandomAlgoViewComponent } from './random-algo-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RandomAlgoViewComponent],
  imports: [
    CommonModule,
    RandomAlgoViewRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RandomAlgoViewModule { }
