import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RandomAlgoComponent } from './random-algo.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: RandomAlgoComponent,
        data: {
          title: 'Random Algo'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomAlgoRoutingModule { }
