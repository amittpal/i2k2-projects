import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishResponseRoutingModule } from './publish-response-routing.module';
import { PublishResponseComponent } from './publish-response.component';


@NgModule({
  declarations: [PublishResponseComponent],
  imports: [
    CommonModule,
    PublishResponseRoutingModule
  ]
})
export class PublishResponseModule { }
