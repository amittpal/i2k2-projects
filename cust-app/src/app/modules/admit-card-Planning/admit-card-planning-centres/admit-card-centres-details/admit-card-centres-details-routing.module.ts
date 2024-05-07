import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardCentresDetailsComponent } from './admit-card-centres-details.component';


const routes: Routes = [
  {
    path:'',
    data:
      {
        title:''
      },
      children:[
        {
          path:'',
          component:AdmitCardCentresDetailsComponent,
          data:{
            title:''
          }
        }
      ]
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardCentresDetailsRoutingModule { }
