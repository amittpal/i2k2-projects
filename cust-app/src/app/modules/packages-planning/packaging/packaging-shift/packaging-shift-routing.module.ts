import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagingShiftComponent } from './packaging-shift.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: ''
      },
      children: [
        {
          path: '',
          component: PackagingShiftComponent,
          data: {
            title: 'Packaging Shift'
          }
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagingShiftRoutingModule { }
