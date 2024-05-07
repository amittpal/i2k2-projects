import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMockQuestionComponent } from './add-mock-question.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component:AddMockQuestionComponent,
        data: {
          title: 'Add Mock Questions'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMockQuestionRoutingModule { }
