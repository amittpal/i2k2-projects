import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutMappingListComponent } from './layout-mapping-list.component';


const routes: Routes = [
    {
      path: '',
      data: {
        title: ''
      },
      children: [
        {
          path: '',
          component: LayoutMappingListComponent,
          data: {
            title: 'LayoutMappingListComponent'
          }
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutMappingListRoutingModule { }
