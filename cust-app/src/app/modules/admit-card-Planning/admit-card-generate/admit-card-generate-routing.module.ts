import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card Generation'
    },
    children: [
      {
        path: '',        
        loadChildren: () => import('./admit-card-generate-list/admit-card-generate-list.module').then(m => m.AdmitCardGenerateListModule)
      },
      {
        path: ':id/generate',
        loadChildren: () => import('./generate-admit-card/generate-admit-card.module').then(m => m.GenerateAdmitCardModule)
      }       
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardGenerateRoutingModule { }
