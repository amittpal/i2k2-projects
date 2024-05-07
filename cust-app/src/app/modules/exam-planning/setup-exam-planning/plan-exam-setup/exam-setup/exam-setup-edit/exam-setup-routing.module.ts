import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamSetupComponent } from './exam-setup.component'


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'setup'
    },
    component: ExamSetupComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamSetupRoutingModule { }
