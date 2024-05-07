import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportedCentresViewComponent } from './imported-centres-view.component';


const routes: Routes = [
  {
    path:'',
    data:
    {
      title:'Imported Centres View'
   },
   children:[
     {
       path:'',
       component:ImportedCentresViewComponent
     }
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportedCentresViewRoutingModule { }
