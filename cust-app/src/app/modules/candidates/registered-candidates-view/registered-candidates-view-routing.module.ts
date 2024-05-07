import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisteredCandidatesViewComponent } from './registered-candidates-view.component';


const routes: Routes = [
  {
    path:'',
    component: RegisteredCandidatesViewComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisteredCandidatesViewRoutingModule { }
