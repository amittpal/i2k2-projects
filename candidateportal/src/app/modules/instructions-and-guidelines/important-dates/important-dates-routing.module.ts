import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportantDatesComponent } from './important-dates.component';


const routes: Routes = [
  {
      path: '',
      data: {
          title: 'Important Dates'
      },
      children: [
          {
              path: '',
              component: ImportantDatesComponent,
              data: {
                  title: 'Important Dates'
              }
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportantDatesRoutingModule { }
