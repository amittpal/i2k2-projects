import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobTypesViewComponent } from './job-types-view.component';


const routes: Routes = [
  {
    path: '',
    component: JobTypesViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobTypesViewRoutingModule { }
