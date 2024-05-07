import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationsListComponent } from './registrations-list.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:' Centre Reg'
    },
    children:[
      {
        path:'',
        component:RegistrationsListComponent,
        data:{
          title:'Centre Registration'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationsListRoutingModule { }
