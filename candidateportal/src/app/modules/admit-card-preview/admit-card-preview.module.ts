import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdmitCardPreviewComponent } from './admit-card-preview.component';
import { AdmitCardPreviewRoutingModule } from './admit-card-preview-routing.module';
import { NgxIxcheckReportsViewerModule } from './../../../app/components/ngx-ixcheck-reports-viewer/ngx-ixcheck-reports-viewer.module'

@NgModule({
  declarations: [AdmitCardPreviewComponent],
  imports: [
    CommonModule,
    AdmitCardPreviewRoutingModule,
    FormsModule,
    NgxIxcheckReportsViewerModule
  ]
})
export class AdmitCardPreviewModule { }
