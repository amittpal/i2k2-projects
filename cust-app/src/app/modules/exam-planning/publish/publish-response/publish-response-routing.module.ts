import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishResponseComponent } from './publish-response.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: PublishResponseComponent, 
        data: {
          title: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishResponseRoutingModule { }
