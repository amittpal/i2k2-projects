import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreEditComponent } from './centre-edit.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Imported centre edit'
    },
    children:[
      {
        path:'',
        component:CentreEditComponent,
        data:{
          title:'Imported centre edit'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentreEditRoutingModule { }
