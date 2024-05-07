import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationViewComponent } from './registration-view.component';


const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [
    {
      path: '',
      component: RegistrationViewComponent,
      data: {
        title: 'RegistrationViewComponent'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationViewRoutingModule { }
