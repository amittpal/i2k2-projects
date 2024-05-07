import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'question'
    },
    children: [
      {
        path: 'requirements',        
        loadChildren: () => import('./question-requirements-list/question-requirements-list.module').then(m => m.QuestionRequirementsListModule)
      } ,
      {
        path: 'requirements/:id/manage',
        loadChildren: () => import('./question-requirements-manage/question-requirements-manage.module').then(m => m.QuestionRequirementsManageModule)
      },
      {
        path: 'requirements/:id',        
        loadChildren: () => import('./question-requirements-view/question-requirements-view.module').then(m => m.QuestionRequirementsViewModule)
      }
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRequirementsRoutingModule { }
