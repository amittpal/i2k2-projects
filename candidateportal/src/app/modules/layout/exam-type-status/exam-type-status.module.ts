import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamTypeStatusComponent } from './exam-type-status.component';



@NgModule({
  declarations: [ExamTypeStatusComponent],
  imports: [
    CommonModule
  ],
  exports:[ExamTypeStatusComponent]
})
export class ExamTypeStatusModule { }
