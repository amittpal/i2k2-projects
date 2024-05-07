import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributionsShiftComponent } from './distributions-shift.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:''
    },
    children:[
      {
      component:DistributionsShiftComponent,
      data:{
        title:'Package distribution'
      }
    }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionsShiftRoutingModule { }
