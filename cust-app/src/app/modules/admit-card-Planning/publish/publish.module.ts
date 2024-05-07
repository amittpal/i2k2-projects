import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishExamListModule } from './publish-exam-list/publish-exam-list.module';
import { PubishRoutingModule } from './publish-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublishExamListModule,
    PubishRoutingModule
  ]
})
export class PublishModule { }
