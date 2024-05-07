import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamMappingComponent } from './exam-mapping.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    component:ExamMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamMappingRoutingModule { }
