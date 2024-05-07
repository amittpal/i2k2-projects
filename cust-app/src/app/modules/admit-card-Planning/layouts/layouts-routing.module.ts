import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card Layout'
    },
    children: [
      {
        path: 'layouts',
        loadChildren: () => import('./layout-list/layout-list.module').then(m => m.LayoutListModule)
      }, 
      {
        path: 'layout/:id/preview',
        loadChildren: () => import('./layout-preview/layout-preview.module').then(m => m.LayoutPreviewModule)
      },
      {
        path: 'layout/mapping',
        loadChildren: () => import('./layout-mapping/layout-mapping.module').then(m => m.LayoutMappingModule)
      }     
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
