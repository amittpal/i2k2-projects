import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsViewComponent } from './jobs-view.component';


const routes: Routes = [
  {
    path: '',
    component: JobsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsViewRoutingModule { }
