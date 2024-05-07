import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationGuidelinesRoutingModule } from './registration-guidelines-routing.module';
import { RegistrationGuidelinesComponent } from './registration-guidelines.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PhotoEditPreviewModule } from '../photo-edit-preview/photo-edit-preview.module';

@NgModule({
  declarations: [RegistrationGuidelinesComponent],
  imports: [
    CommonModule,
    RegistrationGuidelinesRoutingModule,
    AccordionModule.forRoot(),
    PhotoEditPreviewModule
    
  ]
})
export class RegistrationGuidelinesModule { }
