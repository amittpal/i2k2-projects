import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Exam'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./mock-test-exam-list/mock-test-exam-list.module').then(m => m.MockTestExamListModule)
      },
      {
        path: ':examId/questions/manage',
        loadChildren: () => import('./manage-questions/manage-questions.module').then(m => m.ManageQuestionsModule)
      },
      {
        path: ':answerType/:id/add/primary',
        loadChildren: () => import('./manage-questions/primary-questions/add-mock-question/add-mock-question.module').then(m => m.AddMockQuestionModule)
      },
      {
        path: ':answerType/:id/add/secondary',
        loadChildren: () => import('./manage-questions/secondary-questions/add-mock-question-secondary/add-mock-question-secondary.module').then(m => m.AddMockQuestionSecondaryModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MockTestRoutingModule { }
