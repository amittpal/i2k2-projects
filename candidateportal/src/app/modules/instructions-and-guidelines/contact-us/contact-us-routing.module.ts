import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';


const routes: Routes = [
  {
      path: '',
      data: {
          title: 'Contact Us'
      },
      children: [
          {
              path: '',
              component: ContactUsComponent,
              data: {
                  title: 'Contact Us'
              }
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule { }
