import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportAuthorsComponent } from './import-authors.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Import author'
    },
    children:[
      {
        path:'',
        component:ImportAuthorsComponent,
        data: {
          title: 'Import author'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportAuthorsRoutingModule { }
