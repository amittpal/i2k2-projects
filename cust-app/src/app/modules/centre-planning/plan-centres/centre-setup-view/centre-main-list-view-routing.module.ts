import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreMainViewComponent } from './centre-main-view/centre-main-view.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: CentreMainViewComponent,
        data: {
          title: 'CentreMainViewComponent'
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
export class CentreMainListViewRoutingModule { }
