import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobTypesEditComponent } from './job-types-edit.component';


const routes: Routes = [
  {
    path: '',
    component: JobTypesEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobTypesEditRoutingModule { }
