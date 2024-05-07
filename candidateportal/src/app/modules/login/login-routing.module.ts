import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './login-layout/login-layout.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'login'
    },
    children: [
      {
        path: '',
        component: LoginLayoutComponent,
        loadChildren: () => import('./login-prompt/login-prompt.module').then(m => m.LoginPromptModule),
        data: {
          title: 'login'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
