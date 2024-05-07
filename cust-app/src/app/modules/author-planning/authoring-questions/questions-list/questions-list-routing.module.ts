import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsListComponent } from './questions-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    component:QuestionsListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsListRoutingModule { }
