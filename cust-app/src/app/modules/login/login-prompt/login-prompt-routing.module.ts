import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPromptComponent } from './login-prompt.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'login'
    },
    children: [
      {
        path: '',
        component: LoginPromptComponent,
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
export class LoginPromptRoutingModule { }
