import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobTypesAddComponent } from './job-types-add.component';


const routes: Routes = [
  {
    path: '',
    component: JobTypesAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobTypesAddRoutingModule { }
