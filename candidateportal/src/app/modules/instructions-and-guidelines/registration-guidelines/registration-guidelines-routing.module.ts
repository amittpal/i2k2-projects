import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationGuidelinesComponent } from './registration-guidelines.component';


const routes: Routes = [
  {
      path: '',
      data: {
          title: 'Registration Guidlines'
      },
      children: [
          {
              path: '',
              component: RegistrationGuidelinesComponent,
              data: {
                  title: 'Registration Guidlines'
              }
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationGuidelinesRoutingModule { }
