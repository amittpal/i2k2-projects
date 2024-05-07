import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutListComponent } from './layout-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: LayoutListComponent,
        data: {
          title: 'LayoutListComponent'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutListRoutingModule { }
