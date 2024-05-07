import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:'',
    data:{
      title:'Admit Card Publish'
    },
    children:[
      {
        path:'',
        loadChildren:()=>import('./publish-exam-list/publish-exam-list.module').then(m=>m.PublishExamListModule)
      },
      {
        path:'registration/:regGuid',
        loadChildren:()=>import('./publish-admit-card/publish-admit-card.module').then(m=>m.PublishAdmitCardModule)
      }

    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PubishRoutingModule { }
