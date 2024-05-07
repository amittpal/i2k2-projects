import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionRequirementsViewComponent } from './question-requirements-view.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: QuestionRequirementsViewComponent, 
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
export class QuestionRequirementsViewRoutingModule { }
