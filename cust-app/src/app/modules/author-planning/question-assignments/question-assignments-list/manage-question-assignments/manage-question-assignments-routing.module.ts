import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageQuestionAssignmentsComponent } from './manage-question-assignments.component'


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: ManageQuestionAssignmentsComponent,
        data: {
          title: 'Manage Question Assignments Component'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionAssignmentsListRoutingModule { }
