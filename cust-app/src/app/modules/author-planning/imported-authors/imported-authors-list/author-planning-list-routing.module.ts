import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorPlanningListComponent } from './author-planning-list.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: AuthorPlanningListComponent,
        data: {
          title: 'Author Planning List Component'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorPlanningListRoutingModule { }
