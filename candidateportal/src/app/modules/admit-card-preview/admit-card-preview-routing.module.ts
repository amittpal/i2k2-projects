import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmitCardPreviewComponent } from './admit-card-preview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card Preview'
    },
    children: [
      {
        path: ':id/:regId',
        component: AdmitCardPreviewComponent,
        data: {
            title: 'Admit Card Preview'
        }
      }     
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardPreviewRoutingModule { }
