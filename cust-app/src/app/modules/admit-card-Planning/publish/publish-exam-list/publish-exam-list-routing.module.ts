import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishExamListComponent } from './publish-exam-list.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    component:PublishExamListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PubishExamListRoutingModule { }
