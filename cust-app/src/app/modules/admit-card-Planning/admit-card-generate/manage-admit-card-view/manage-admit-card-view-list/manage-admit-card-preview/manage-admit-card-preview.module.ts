import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageAdmitCardPreviewRoutingModule } from './manage-admit-card-preview-routing.module'; 
import { ManageAdmitCardPreviewComponent } from './manage-admit-card-preview.component'
import {NgxIxcheckReportsViewerModule} from './../../../../../../../app/components/ngx-ixcheck-reports-viewer/ngx-ixcheck-reports-viewer.module'


@NgModule({
  declarations: [ManageAdmitCardPreviewComponent],
  imports: [
    CommonModule,
    ManageAdmitCardPreviewRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckReportsViewerModule
  ]
})
export class ManageAdmitCardPreviewModule { }
