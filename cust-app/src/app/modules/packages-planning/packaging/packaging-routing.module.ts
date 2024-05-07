import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Packaging'
    },
    children: [
        {
            path: '',        
            loadChildren: () => import('./packaging-list/packaging-list.module').then(m => m.PackagingListModule)
          },
          {
            path: ':id/manage',        
            loadChildren: () => import('./packaging-shift/packaging-shift.module').then(m => m.PackagingShiftModule)
          }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagingRoutingModule { }
