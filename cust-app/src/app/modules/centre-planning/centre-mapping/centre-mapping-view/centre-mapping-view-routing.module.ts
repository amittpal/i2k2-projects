import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreMappingViewComponent } from './centre-mapping-view.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Centre mapped view'
    },
    children:[
      {
        path:'',
        component:CentreMappingViewComponent,
        data:{
          title:'Centre mapped view'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentreMappingViewRoutingModule { }
