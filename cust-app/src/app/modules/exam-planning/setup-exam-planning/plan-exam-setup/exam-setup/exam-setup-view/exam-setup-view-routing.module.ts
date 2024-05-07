import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamSetupViewComponent } from './exam-setup-view.component'


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'view'
    },
    component: ExamSetupViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamSetupViewRoutingModule { }
