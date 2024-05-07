import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageAdmitCardEmailPreviewRoutingModule } from './manage-admit-card-email-preview-routing.module'; 
import { ManageAdmitCardEmailPreviewComponent } from './manage-admit-card-email-preview.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [ManageAdmitCardEmailPreviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageAdmitCardEmailPreviewRoutingModule,
    QuillModule.forRoot()
  ]
})
export class ManageAdmitCardEmailPreviewModule { }
