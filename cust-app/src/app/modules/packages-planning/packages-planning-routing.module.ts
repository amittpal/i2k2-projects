import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Packages'
    },
    children: [
      {
        path: 'setup',
        loadChildren: () => import('./setup/setup.module').then(m => m.SetupModule)
      },
      {
        path: 'pool',
        loadChildren: () => import('./packaging/packaging.module').then(m => m.PackagingModule)
      },
      {
        path:'distributions',
        loadChildren:()=>import('./distributions/distributions.module').then(m=>m.DistributionsModule)
      }
      
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesPlanningRoutingModule { }
