import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutMappingViewComponent } from './layout-mapping-view.component';


const routes: Routes = [
    {
      path: '',
      data: {
        title: ''
      },
      children: [
        {
          path: '',
          component: LayoutMappingViewComponent,
          data: {
            title: 'LayoutMappingViewComponent'
          }
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutMappingViewRoutingModule { }
