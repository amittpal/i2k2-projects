import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RandomAlgoEditRoutingModule } from './random-algo-edit-routing.module';
import { RandomAlgoEditComponent } from './random-algo-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RandomAlgoEditComponent],
  imports: [
    CommonModule,
    RandomAlgoEditRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RandomAlgoEditModule { }
