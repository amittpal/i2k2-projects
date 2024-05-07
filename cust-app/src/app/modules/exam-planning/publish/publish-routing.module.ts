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
        loadChildren: () => import('./publish-list/publish-list.module').then(m => m.PublishListModule)
      },
      {
        path: ':examId/response',
        loadChildren: () => import('./publish-response/publish-response.module').then(m => m.PublishResponseModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishRoutingModule { }
