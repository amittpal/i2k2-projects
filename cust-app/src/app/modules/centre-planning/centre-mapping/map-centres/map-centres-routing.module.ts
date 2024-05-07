import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapCentresComponent } from './map-centres.component';


const routes: Routes = [

  {
    path:'',
    data:{
      title:'Map exam to centre'
    },
    children:[
      {
        path:'',
        component:MapCentresComponent,
        data:{
          title:'Map exam to centre'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapCentresRoutingModule { }
