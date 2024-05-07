import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamDashboardComponent } from './exam-dashboard.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'exam-dashboard'
    },
  component:ExamDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamDashboardRoutingModule { }
