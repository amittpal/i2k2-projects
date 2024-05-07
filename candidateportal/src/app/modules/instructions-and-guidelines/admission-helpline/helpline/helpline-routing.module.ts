import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelplineComponent } from './helpline.component';


const routes: Routes = [
  {
      path: '',
      data: {
          title: 'Helpline'
      },
      children: [
          {
              path: '',
              component: HelplineComponent,
              data: {
                  title: 'Helpline'
              }
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelplineRoutingModule { }
