import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CopyLayoutComponent } from './copy-layout.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: CopyLayoutComponent,
        data: {
          title: 'CopyLayoutComponent'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyLayoutRoutingModule { }
