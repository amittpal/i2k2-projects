import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportComponent } from './import.component';
import { ImportViewComponent } from './import-view/import-view.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:' Centre Import Registration'
    },
    children:[
      {
        path:'',
        component:ImportComponent,
        data:{
          title:'Import Registration'
        }
      },
      {
        path:'view',
        component:ImportViewComponent,
        data:{
          title:'Import View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
