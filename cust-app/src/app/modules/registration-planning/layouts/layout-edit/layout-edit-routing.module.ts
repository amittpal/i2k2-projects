import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutEditComponent } from './layout-edit.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: LayoutEditComponent,
        data: {
          title: 'LayoutEditComponent'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutEditRoutingModule { }
