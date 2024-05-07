import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RandomAlgoViewComponent } from './random-algo-view.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: RandomAlgoViewComponent,
        data: {
          title: 'Random Algo View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomAlgoViewRoutingModule { }
