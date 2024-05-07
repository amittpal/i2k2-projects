import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Registration Add'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./registration-list/registration-list.module').then(m => m.RegistrationListModule)
      },
      {
        path: 'add',
        loadChildren: () => import('./registration-add/registration-add.module').then(m => m.RegistrationAddModule)
      },
      {
        path: ':registrationGuid/manage',
        loadChildren: () => import('./registration-edit/registration-edit.module').then(m => m.RegistrationEditModule)
      },
      {
        path: ':registrationGuid/view',
        loadChildren: () => import('./registration-view/registration-view.module').then(m => m.RegistrationViewModule)
      },
      {
        path: 'import',
        loadChildren: () => import('./registration-import/registration-import.module').then(m => m.RegistrationImportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
