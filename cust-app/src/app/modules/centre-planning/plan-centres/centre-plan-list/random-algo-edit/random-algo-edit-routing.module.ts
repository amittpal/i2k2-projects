import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RandomAlgoEditComponent } from './random-algo-edit.component';


const routes: Routes = [

  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: RandomAlgoEditComponent,
        data: {
          title: 'Random Algo Edit'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomAlgoEditRoutingModule { }
