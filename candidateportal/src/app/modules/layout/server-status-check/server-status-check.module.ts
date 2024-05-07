import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerStatusCheckRoutingModule } from './server-status-check-routing.module';
import { ServerStatusCheckComponent } from './server-status-check.component';


@NgModule({
  declarations: [ServerStatusCheckComponent],
  imports: [
    CommonModule,
    ServerStatusCheckRoutingModule
  ],
  exports:[ServerStatusCheckComponent]
})
export class ServerStatusCheckModule { }
