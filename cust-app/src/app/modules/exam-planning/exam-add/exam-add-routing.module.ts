import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamAddComponent } from './exam-add.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'view'
  },
  component: ExamAddComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamAddRoutingModule { }
