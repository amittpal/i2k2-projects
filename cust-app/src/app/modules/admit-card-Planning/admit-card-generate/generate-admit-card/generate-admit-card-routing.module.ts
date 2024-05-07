import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateAdmitCardComponent } from './generate-admit-card/generate-admit-card.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Generate Admit Card'
    },
    children: [
      {
        path: '',        
        component: GenerateAdmitCardComponent
      }          
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateAdmitCardRoutingModule { }
