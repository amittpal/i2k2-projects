import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMockQuestionSecondaryComponent } from './add-mock-question-secondary.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component:AddMockQuestionSecondaryComponent,
        data: {
          title: 'Add Mock Question Secondary Component'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMockQuestionSecondaryRoutingModule { }
