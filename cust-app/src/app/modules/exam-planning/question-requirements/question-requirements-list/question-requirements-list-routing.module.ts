import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionRequirementsListComponent } from './question-requirements-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: QuestionRequirementsListComponent,
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
export class QuestionRequirementsListRoutingModule { }
