import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Directive
import{HtmlToTextPipe} from './html-to-text.pipe';
@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        HtmlToTextPipe
    ],
    declarations: [
        HtmlToTextPipe
    ]
})
export class HtmlToTextModule { }