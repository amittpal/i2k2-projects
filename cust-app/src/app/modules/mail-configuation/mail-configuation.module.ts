import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MailConfiguationRoutingModule } from './mail-configuation-routing.module';
import { MailConfiguationComponent } from './mail-configuation.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [MailConfiguationComponent],
  imports: [
    CommonModule,
    MailConfiguationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ]
})
export class MailConfiguationModule { }
