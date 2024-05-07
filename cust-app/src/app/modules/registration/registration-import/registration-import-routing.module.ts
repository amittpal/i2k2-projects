import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationImportComponent } from './registration-import.component';


const routes: Routes = [
  {
    path: '',
    component: RegistrationImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationImportRoutingModule { }
