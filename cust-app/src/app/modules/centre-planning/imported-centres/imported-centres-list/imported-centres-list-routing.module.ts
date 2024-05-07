import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportedCentresListComponent } from './imported-centres-list.component';


const routes: Routes = [
  {
  path:'',
  data:{
    title:'imported Centre list'
  },
  children:[
    {
      path:'',
      component:ImportedCentresListComponent,
      data:{
        title:'imported Centre listg'
      }
    }
  ]
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportedCentresListRoutingModule { }
