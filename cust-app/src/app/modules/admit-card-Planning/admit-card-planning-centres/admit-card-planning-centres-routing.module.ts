import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Admit Card Centres'
    },
    children:[
      {
        path:'',
        loadChildren:()=>import('./admit-card-exam-list/admit-card-exam-list.module').then(m=>m.AdmitCardExamListModule)
      },
    
      {
        path:'details/:id/:shift',
        loadChildren:()=>import('./admit-card-centres-details/admit-card-centres-details.module').then(m=>m.AdmitCardCentresDetailsModule)
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardPlanningCentresRoutingModule { }
