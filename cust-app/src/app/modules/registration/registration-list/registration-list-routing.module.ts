import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationListComponent } from './registration-list.component';


const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [
    {
      path: '',
      component: RegistrationListComponent,
      data: {
        title: 'RegistrationListComponent'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationListRoutingModule { }
