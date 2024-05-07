import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignQuestionsComponent } from '../assign-questions/assign-questions.component'


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: AssignQuestionsComponent,
        data: {
          title: 'Assign Questions Component'
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
