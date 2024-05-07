import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMoreCenterComponent } from './add-more-center.component';


const routes: Routes = [{
  path:'',
  data:{
    title:'Add More Center'
  },
  children:[
    {
      path:'',
      component:AddMoreCenterComponent,
      data:{
        title:'Add More Center'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMoreCenterRoutingModule { }
