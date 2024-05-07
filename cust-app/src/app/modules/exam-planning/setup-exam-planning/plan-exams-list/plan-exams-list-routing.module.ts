import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlanExamsListComponent} from './plan-exams-list.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: PlanExamsListComponent,
        data: {
          title: 'PlanExamsListComponent'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanExamsListRoutingModule { }
