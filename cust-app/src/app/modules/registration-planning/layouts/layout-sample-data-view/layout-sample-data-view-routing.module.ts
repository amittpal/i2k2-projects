import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutSampleDataViewComponent } from './layout-sample-data-view.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:''
    },
    children:[
      {
        path:'',
        component:LayoutSampleDataViewComponent,
        data:{
          title:'LayoutSampleDataViewComponent'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutSampleDataViewRoutingModule { }
