import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FillBlankComponent } from './fill-blank/fill-blank.component';
import { MatchComponent } from './match/match.component';
import { MultipleChoiceComponent } from './multiple-choice/multiple-choice.component';
import { SingleChoiceComponent } from './single-choice/single-choice.component';
import { TrueFalseComponent } from './true-false/true-false.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuillModule } from 'ngx-quill';
import { HtmlToTextModule } from 'src/app/shared/pipes/HtmlToText/html-to-text.module';


//register quill image resize module
import ImageResize from 'quill-image-resize';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
Quill.register('modules/imageResize', ImageResize);

@NgModule({
  declarations: [
    FillBlankComponent, 
    MatchComponent, 
    MultipleChoiceComponent, 
    SingleChoiceComponent, 
    TrueFalseComponent
  ],
  imports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,        
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AngularSvgIconModule,    
    QuillModule.forRoot(),           
    HtmlToTextModule
  ],
  exports:[
    FillBlankComponent, 
    MatchComponent, 
    MultipleChoiceComponent, 
    SingleChoiceComponent, 
    TrueFalseComponent
  ]
})
export class MockQuestionTypesSecondaryModule { }
