import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Authoring Questions'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./questions-list/questions-list.module').then(m => m.QuestionsListModule)
      },    
      {
        path: ':id/manage',
        loadChildren: () => import('./manage-questions/manage-questions.module').then(m => m.ManageQuestionsModule)
      },
      //primary question routes 
      {
        path: ':answerType/:id/add/primary',
        loadChildren: () => import('./manage-questions/primary-question/add-question/add-question.module').then(m => m.AddQuestionModule)
      },
      {
        path: ':answerType/:id/review/primary',
        loadChildren: () => import('./manage-questions/primary-question/review-question/review-question.module').then(m => m.ReviewQuestionModule)
      },
      {
        path: ':answerType/:id/approve/primary',
        loadChildren: () => import('./manage-questions/primary-question/approve-question/approve-question.module').then(m => m.ApproveQuestionModule)
      },
       //secondary question routes 
       {
        path: ':answerType/:id/add/secondary',
        loadChildren: () => import('./manage-questions/secondary-question/add-question/add-question.module').then(m => m.AddQuestionModule)
      },
      {
        path: ':answerType/:id/review/secondary',
        loadChildren: () => import('./manage-questions/secondary-question/review-question/review-question.module').then(m => m.ReviewQuestionModule)
      },
      {
        path: ':answerType/:id/approve/secondary',
        loadChildren: () => import('./manage-questions/secondary-question/approve-question/approve-question.module').then(m => m.ApproveQuestionModule)
      } 

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthoringQuestionsRoutingModule { }
