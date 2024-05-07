import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq.component';


const routes: Routes = [
  {
      path: '',
      data: {
          title: 'Faq'
      },
      children: [
          {
              path: '',
              component: FaqComponent,
              data: {
                  title: 'Faq'
              }
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
