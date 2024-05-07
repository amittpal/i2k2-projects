import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutMappingAddComponent } from './layout-mapping-add/layout-mapping-add.component';



const routes: Routes = [ 
  {
    path: ':registrationGuid/add',
    data: {
      title: ''
    },
    component:LayoutMappingAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutMappingRoutingModule { }
