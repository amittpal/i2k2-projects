import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoEditPreviewComponent } from './photo-edit-preview.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [PhotoEditPreviewComponent],
  imports: [
    CommonModule,
    ImageCropperModule    
  ],
  exports:[PhotoEditPreviewComponent]
})
export class PhotoEditPreviewModule { }
