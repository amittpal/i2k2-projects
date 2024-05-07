import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisteredCandidatesComponent } from './registered-candidates.component'


const routes: Routes = [
  {
    path:'',
    component: RegisteredCandidatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisteredCandidatesRoutingModule { }
