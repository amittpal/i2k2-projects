import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'candidates'
    },
    children: [
      {
        path: 'registrations',
        loadChildren: () => import('./candidate-registrations/candidate-registrations.module').then(m => m.CandidateRegistrationsModule)
      },
      {
        path: 'registrations/:guid/registered/candidates',
        loadChildren: () => import('./registered-candidates/registered-candidates.module').then(m => m.RegisteredCandidatesModule)
      },
      {
        path: ':cId/view',
        loadChildren: () => import('./registered-candidates-view/registered-candidates-view.module').then(m => m.RegisteredCandidatesViewModule)
      },
       {
        path: 'registrations/:guid/registered/candidates/:candidateGuid/manage',
        loadChildren: () => import('./registered-exam/registered-exam.module').then(m => m.RegisteredExamModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatesRoutingModule { }
