import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentrePlanListComponent } from './centre-plan-list.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: CentrePlanListComponent,
        data: {
          title: 'CentrePlanListComponent'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentrePlanListRoutingModule { }
