import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportCentreComponent } from './import-centre.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Import Centre'
    },
    children:[
      {
        path:'',
        component:ImportCentreComponent,
        data:{
          title:'Import Centre'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportCentreRoutingModule { }
