import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproveQuestionComponent } from './approve-question.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component:ApproveQuestionComponent,
        data: {
          title: 'Approve Question Component'
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveQuestionRoutingModule { }
