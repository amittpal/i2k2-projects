import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreMappingListComponent } from './centre-mapping-list.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Centre Mapping List'
    },
    children:[
      {
        path:'',
        component:CentreMappingListComponent,
        data:{
          title:{
            title:'Centre Mapping List'
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentreMappingListRoutingModule { }
