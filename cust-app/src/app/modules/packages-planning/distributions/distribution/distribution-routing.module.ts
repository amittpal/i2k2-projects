import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributionComponent } from './distribution.component';


const routes: Routes = [
  {
    path:'' ,
    data:{
      title:''
    },
    children:[
      {
        path:'',
        component:DistributionComponent,
        data:{
          title:'Package Distribution'
        }
      }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionRoutingModule { }
