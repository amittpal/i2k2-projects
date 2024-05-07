import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardRegistrationsComponent } from './admit-card-registrations.component';


const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [
    {
      path: '',
      component: AdmitCardRegistrationsComponent,
      data: {
        title: 'Admit Card Registration List'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardRegistrationsRoutingModule { }
