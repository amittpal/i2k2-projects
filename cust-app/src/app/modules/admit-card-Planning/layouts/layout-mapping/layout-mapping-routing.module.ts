import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Layout Mapping'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./layout-mapping-list/layout-mapping-list.module').then(m => m.LayoutMappingListModule)
      },
      {
        path: ':registrationGuid/add',
        loadChildren: () => import('./layout-mapping-add/layout-mapping-add.module').then(m => m.LayoutMappingAddModule)
      },
      {
        path: ':registrationGuid/view',
        loadChildren: () => import('./layout-mapping-view/layout-mapping-view.module').then(m => m.LayoutMappingViewModule)
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutMappingRoutingModule { }
