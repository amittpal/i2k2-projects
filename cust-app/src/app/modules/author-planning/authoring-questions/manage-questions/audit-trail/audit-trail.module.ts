import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditTrailComponent } from './audit-trail.component';
//import { HtmlToTextPipe } from 'src/app/shared/pipes/HtmlToText/html-to-text.pipe';

@NgModule({
  declarations: [AuditTrailComponent],
  imports: [
    CommonModule
  ],
  exports:[AuditTrailComponent]
})
export class AuditTrailModule { }
