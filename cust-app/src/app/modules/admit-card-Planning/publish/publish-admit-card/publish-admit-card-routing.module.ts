import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishAdmitCardComponent } from './publish-admit-card.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    component:PublishAdmitCardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PubishAdmitCardRoutingModule { }
