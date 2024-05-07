import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionAssignmentsListComponent } from './question-assignments-list.component'


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: QuestionAssignmentsListComponent,
        data: {
          title: 'Question Assignments List Component'
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
