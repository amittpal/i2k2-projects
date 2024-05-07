import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewQuestionComponent } from './review-question.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component:ReviewQuestionComponent,
        data: {
          title: 'Review Question Component'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewQuestionRoutingModule { }
