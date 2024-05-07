import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Layout'
    },
    children: [
      {
        path: 'layouts',
        loadChildren: () => import('./layout-list/layout-list.module').then(m => m.LayoutListModule)
      },
      {
        path: 'layout/add',
        loadChildren: () => import('./layout-add/layout-add.module').then(m => m.LayoutAddModule)
      },
      {
        path: 'layout/mapping',
        loadChildren: () => import('./layout-mapping/layout-mapping.module').then(m => m.LayoutMappingModule)
      },
      {
        path: 'layout/:id/edit',
        loadChildren: () => import('./layout-edit/layout-edit.module').then(m => m.LayoutEditModule)
      }, 
      {
        path: 'layout/:id/preview',
        loadChildren: () => import('./layout-preview/layout-preview.module').then(m => m.LayoutPreviewModule)
      },
      {
        path: 'layout/:id/sample-data',
        loadChildren: () => import('./layout-sample-data/layout-sample-data.module').then(m => m.LayoutSampleDataModule)
      },
      {
        path: 'exam/mapping',
        loadChildren: () => import('./exam-mapping/exam-mapping.module').then(m => m.ExamMappingModule)
      },  
      {
        path:'layout/:id/sample-data-view',
        loadChildren:()=>import('./layout-sample-data-view/layout-sample-data-view.module').then(m=>m.LayoutSampleDataViewModule)
      },
      {
        path:'layout/:id/copy',
        loadChildren:()=>import('./copy-layout/copy-layout.module').then(m=>m.CopyLayoutModule)
      }          
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
