import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishAdmitCardComponent } from './publish-admit-card.component';
import { PubishAdmitCardRoutingModule  } from './publish-admit-card-routing.module';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';


@NgModule({
  declarations: [PublishAdmitCardComponent],
  imports: [
    CommonModule,
    PubishAdmitCardRoutingModule,
    NgxIxcheckTableLibModule
  ]
})
export class PublishAdmitCardModule { }
