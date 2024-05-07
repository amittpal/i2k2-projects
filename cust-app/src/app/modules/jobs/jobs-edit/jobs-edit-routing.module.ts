import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsEditComponent } from './jobs-edit.component';


const routes: Routes = [
  {
    path: '',
    component: JobsEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsEditRoutingModule { }
