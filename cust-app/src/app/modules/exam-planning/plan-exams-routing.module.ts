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
        path: 'planning',
        loadChildren: () => import('./setup-exam-planning/plan-exams-list/plan-exams-list.module').then(m => m.PlanExamsListModule)
      },

      {
        path: ':examId/setup',
        loadChildren: () => import('./setup-exam-planning/plan-exam-setup/exam-setup/exam-setup-edit/exam-setup.module').then(m => m.ExamSetupModule)
      },
      {
        path: ':examId/view',
        loadChildren: () => import('./setup-exam-planning/plan-exam-setup/exam-setup/exam-setup-view/exam-setup-view.module').then(m => m.ExamSetupViewModule)
      },
      {
        path: ':examId/setup/:id',
        loadChildren: () => import('./setup-exam-planning/plan-exam-setup/exam-setup/exam-setup-edit/exam-setup.module').then(m => m.ExamSetupModule)
      },
      {
        path: ':examId/view/:id',
        loadChildren: () => import('./setup-exam-planning/plan-exam-setup/exam-setup/exam-setup-view/exam-setup-view.module').then(m => m.ExamSetupViewModule)
      },
      {
        path: 'mock-test',
        loadChildren: () => import('./mock-test/mock-test.module').then(m => m.MockTestModule)
      },
      {
        path: 'publish',
        loadChildren: () => import('./publish/publish.module').then(m => m.PublishModule)
      },
      {
        path: 'add',
        loadChildren: () => import('./exam-add/exam-add.module').then(m => m.ExamAddModule)
      }
    ]
  }
]; 


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanExamsRoutingModule { }
