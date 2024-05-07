import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockTestExamListComponent } from './mock-test-exam-list.component';


const routes: Routes = [
  {
    path:'',
    component:MockTestExamListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MockTestExamListRoutingModule { }
