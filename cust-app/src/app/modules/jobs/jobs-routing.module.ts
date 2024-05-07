import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'jobs'
    },
    children: [
      {
        path: '',
        loadChildren: './jobs-list/jobs-list.module#JobsListModule'
      },
      {
        path: 'add',
        loadChildren: './jobs-add/jobs-add.module#JobsAddModule'
      },
      {
        path: 'types',
        loadChildren: './job-types/job-types.module#JobTypesModule'
      },
      {
        path: ':id',
        loadChildren: './jobs-view/jobs-view.module#JobsViewModule'
      },
      {
        path: ':id/edit',
        loadChildren: './jobs-edit/jobs-edit.module#JobsEditModule'
      }, 
      {
        path: ':id/view',
        loadChildren: './jobs-view/jobs-view.module#JobsViewModule'
      },      
      {
        path: 'types/add',
        loadChildren: './job-types-add/job-types-add.module#JobTypesAddModule'
      },
      {
        path: 'types/:id/view',
        loadChildren: './job-types-view/job-types-view.module#JobTypesViewModule'        
      },
      {
        path: 'types/:id/edit',
        loadChildren: './job-types-edit/job-types-edit.module#JobTypesEditModule'        
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
