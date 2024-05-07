import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MailConfiguationComponent } from './mail-configuation.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'mail-configuation'
    },
    component: MailConfiguationComponent,
    //if main child exists
    // children: [
    //   {
    //     path: '',
    //     loadChildren: './main-child/main-child.module#MainChildModule',
    //     data: {
    //       title: 'main child'
    //     }
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailConfiguationRoutingModule { }









