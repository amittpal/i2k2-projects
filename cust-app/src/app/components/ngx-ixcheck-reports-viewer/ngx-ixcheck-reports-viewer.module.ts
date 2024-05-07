import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxIxcheckReportsViewerComponent } from './component/ngx-ixcheck-reports-viewer.component';

export { NgxIxcheckReportsViewerComponent };

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxIxcheckReportsViewerComponent
  ],
  exports: [
    NgxIxcheckReportsViewerComponent
  ]
})
export class NgxIxcheckReportsViewerModule { }
