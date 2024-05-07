import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardCentreRegistrationsComponent } from './admit-card-centre-registrations.component';


const routes: Routes = [

  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: AdmitCardCentreRegistrationsComponent,
        data: {
          title: 'Admit Card Registration List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardCentreRegistrationsRoutingModule { }
