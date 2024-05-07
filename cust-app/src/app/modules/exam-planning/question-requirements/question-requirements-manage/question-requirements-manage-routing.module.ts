import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionRequirementsManageComponent } from './question-requirements-manage.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: QuestionRequirementsManageComponent, 
        data: {
          title: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRequirementsManageRoutingModule { }
