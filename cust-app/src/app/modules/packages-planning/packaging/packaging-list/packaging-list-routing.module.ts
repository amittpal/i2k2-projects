import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagingListComponent } from './packaging-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: PackagingListComponent,
        data: {
          title: 'Packaging List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagingListRoutingModule { }
