import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServerStatusCheckComponent } from './server-status-check.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'server status check'
    },
  component:ServerStatusCheckComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerStatusCheckRoutingModule { }
