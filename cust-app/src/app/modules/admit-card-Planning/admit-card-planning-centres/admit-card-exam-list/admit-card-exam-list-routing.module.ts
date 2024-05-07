import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardExamListComponent } from './admit-card-exam-list.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'',

    },
    children:[

      {
        path:'',
        component:AdmitCardExamListComponent,
        data:{
          title:''
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardExamListRoutingModule { }
