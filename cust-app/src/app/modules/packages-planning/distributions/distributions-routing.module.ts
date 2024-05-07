import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  
    {
      path: '',
      data: {
        title: 'Distributions'
      },
      children: [
          {
              path: '',        
              loadChildren: () => import('./distribution/distribution.module').then(m => m.DistributionModule)
            },
            {
              path: ':id/manage',        
              loadChildren: () => import('./distributions-shift/distributions-shift.module').then(m => m.DistributionsShiftModule)
            }
      ]
    }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionsRoutingModule { }
