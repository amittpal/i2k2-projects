import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateRegistrationsComponent } from './candidate-registrations.component';


const routes: Routes = [
  {
    path:'',
    component: CandidateRegistrationsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRegistrationsRoutingModule { }
