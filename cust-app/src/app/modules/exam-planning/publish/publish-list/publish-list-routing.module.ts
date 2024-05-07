import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishListComponent } from './publish-list.component';


const routes: Routes = [
  {
    path:'',
    component:PublishListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishListRoutingModule { }
