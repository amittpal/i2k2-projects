import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Centre'
    },
    children: [
      {
        path: 'planning',
        loadChildren: () => import('./centre-plan-list/centre-plan-list.module').then(m => m.CentrePlanListModule)
      },
      {
        path: 'registration/:examId/snapshot/:snapShotId/setup',
        loadChildren: () => import('./centre-setup/centre-main.module').then(m => m.CentreMainModule)
      },
      {
        path: ':examId/view',
        loadChildren: () => import('./centre-setup-view/centre-main-view.module').then(m => m.CentreMainViewModule)
      },
     
      {
        path: 'registrations/list',
        loadChildren: () => import('../centre-registrations/registrations-list/registrations-list.module').then(m => m.RegistrationsListModule)
      },
      {
        path:'import/list/:examGuid/:importId',
        loadChildren:()=>import('../centre-registrations/import/import.module').then(m=>m.ImportModule)
       },
       {
        path:'registration/:regGuid/random/algo',
        loadChildren:()=>import('./centre-plan-list/random-algo/random-algo.module').then(m=>m.RandomAlgoModule)
      },
      {
        path:'registration/:regGuid/random/algo/view',
        loadChildren:()=>import('./centre-plan-list/random-algo-view/random-algo-view.module').then(m=>m.RandomAlgoViewModule)
      },
      {
        path:'registration/:regGuid/random/algo/edit',
        loadChildren:()=>import('./centre-plan-list/random-algo-edit/random-algo-edit.module').then(m=>m.RandomAlgoEditModule)
      }
      
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CentrePlanRoutingModule { }
