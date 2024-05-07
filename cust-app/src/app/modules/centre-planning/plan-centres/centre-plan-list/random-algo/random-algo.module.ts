import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RandomAlgoRoutingModule } from './random-algo-routing.module';
import { RandomAlgoComponent } from './random-algo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RandomAlgoComponent],
  imports: [
    CommonModule,
    RandomAlgoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class RandomAlgoModule { }
