import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRegistrationComponent } from './manage-registration.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'manage'
    },
    component:ManageRegistrationComponent
   
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRegistrationRoutingModule { }
