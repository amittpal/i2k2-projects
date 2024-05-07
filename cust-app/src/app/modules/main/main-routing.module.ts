import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { MainLayoutComponent } from './main-layout/main-layout.component';
//import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MainComponent } from './main.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'demo'
    },
    component: MainComponent,
    //if main child exists
    // children: [
    //   {
    //     path: '',
    //     loadChildren: './main-child/main-child.module#MainChildModule',
    //     data: {
    //       title: 'main child'
    //     }
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
