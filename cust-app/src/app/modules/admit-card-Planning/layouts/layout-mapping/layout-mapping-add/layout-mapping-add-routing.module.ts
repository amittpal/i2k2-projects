import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutMappingAddComponent } from './layout-mapping-add.component';


const routes: Routes = [
    {
      path: '',
      data: {
        title: ''
      },
      children: [
        {
          path: '',
          component: LayoutMappingAddComponent,
          data: {
            title: 'LayoutMappingAddComponent'
          }
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutMappingAddRoutingModule { }
