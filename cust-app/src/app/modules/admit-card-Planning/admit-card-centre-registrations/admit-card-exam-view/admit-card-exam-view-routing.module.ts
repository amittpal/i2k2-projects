import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardExamListComponent } from '../../admit-card-planning-centres/admit-card-exam-list/admit-card-exam-list.component';
import { AdmitCardExamViewComponent } from './admit-card-exam-view.component';


const routes: Routes = [ {
  path: '',
  data: {
    title: ''
  },
  children: [
    {
      path: '',
      component: AdmitCardExamViewComponent,
      data: {
        title: 'Manage Admit Card Generate'
      }
    }
  ]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardExamViewRoutingModule { }
