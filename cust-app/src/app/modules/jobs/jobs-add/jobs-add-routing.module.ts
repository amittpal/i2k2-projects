import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsAddComponent } from './jobs-add.component';


const routes: Routes = [
  {
    path: '',
    component: JobsAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsAddRoutingModule { }
