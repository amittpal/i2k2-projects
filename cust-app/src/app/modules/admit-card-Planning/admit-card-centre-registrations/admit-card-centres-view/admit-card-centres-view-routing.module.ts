import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardCentresViewComponent } from './admit-card-centres-view.component';




const routes: Routes = [ {
  path: '',
  data: {
    title: ''
  },
  children: [
    {
      path: '',
      component: AdmitCardCentresViewComponent,
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
export class AdmitCardCentresViewRoutingModule { }
