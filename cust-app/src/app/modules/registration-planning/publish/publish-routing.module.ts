import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { PublishRegistrationComponent } from './publish-registration/publish-registration.component';
import { ExtendRegistrationComponent } from './extend-registration/extend-registration.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    component:RegistrationListComponent
  },  
  {
    path: ':registrationGuid',
    data: {
      title: ''
    },
    component:PublishRegistrationComponent
  },  
  {
    path: ':registrationGuid/extend',
    data: {
      title: ''
    },
    component:ExtendRegistrationComponent
  }  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishRegistrationRoutingModule { }
