import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Centre Planning'
    },
    children: [
      
      {
        path: 'add/more/center/:id',
        loadChildren: () => import('./imported-centres/add-more-center/add-more-center.module').then(m => m.AddMoreCenterModule)
      },
      {
        path: 'centres',
        loadChildren: () => import('./imported-centres/imported-centres-list/imported-centres-list.module').then(m => m.ImportedCentresListModule)
      },
      {
        path: 'centres/:id',
        loadChildren: () => import('./imported-centres/imported-centres-view/imported-centres-view.module').then(m => m.ImportedCentresViewModule)
      },
      {
        path: 'centres/:id/edit',
        loadChildren: () => import('./imported-centres/centre-edit/centre-edit.module').then(m => m.CentreEditModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./centre-mapping/centre-mapping-list/centre-mapping-list.module').then(m => m.CentreMappingListModule)
      },
      {
        path: 'mapping/:id/mapcentres',
        loadChildren: () => import('./centre-mapping/map-centres/map-centres.module').then(m => m.MapCentresModule)

      },
      {
        path: 'import/centre',
        loadChildren: () => import('./import-centre/import-centre.module').then(m => m.ImportCentreModule)
      },
      {
        path: 'centres/mapped/view/:id',
        loadChildren: () => import('./centre-mapping/centre-mapping-view/centre-mapping-view.module').then(m => m.CentreMappingViewModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule)
      },
      //  {
      //   path:'registrations/list',
      //   loadChildren:()=>import('./centre-registrations/registrations-list/registrations-list.module').then(m=>m.RegistrationsListModule)
      //  },     
      //  {
      //   path:'import/list/:id',
      //   loadChildren:()=>import('./centre-registrations/import/import.module').then(m=>m.ImportModule)
      //  }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentrePlanningRoutingModule { }